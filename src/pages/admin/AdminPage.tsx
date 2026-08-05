import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  FaArrowRight,
  FaChevronDown,
  FaClockRotateLeft,
  FaEye,
  FaFileLines,
  FaFloppyDisk,
  FaPen,
  FaPlus,
  FaRotateRight,
  FaRocket,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchAdminNews, type NewsRecord } from "../../api/newsApi";
import {
  createContentVersion,
  fetchContentVersions,
  getPageContent,
  updatePageContent,
  type ContentVersionSummary,
} from "../../api/pageContentApi";
import {
  archivePage,
  createDraftPage,
  publishPage,
  submitPageForReview,
} from "../../api/pageAdminApi";
import {
  getPageVersionDiff,
  restorePageVersionAsDraft,
  type VersionDiffItem,
} from "../../api/contentVersionApi";
import { getSectionStyle } from "../../data/contentData";
import type {
  AwardCommittee,
  AwardTier,
  EditableContent,
  PageImageItem,
  PageSectionKind,
  PageSectionStyle,
  RegulationSection,
  ResearchFieldItem,
  WorkshopItem,
} from "../../data/contentData";
import { researchIconOptions } from "../../config/pageCustomization";
import { useUser } from "../../hook/useUser";
import LoadingPage from "../../components/loading/LoadingPage";
import AdminLayout from "../../components/admin/AdminLayout";
import { validatePageContentInput } from "../../validation/contentValidation";
import VersionDiffViewer from "../../components/admin/version/VersionDiffViewer";
import VersionRestoreDialog from "../../components/admin/version/VersionRestoreDialog";

const dateFormatter = new Intl.DateTimeFormat("vi-VN");
const inputClass =
  "w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-amber-50 outline-none transition placeholder:text-amber-50/30 focus:border-[#ff6a1f] focus:ring-2 focus:ring-[#ff6a1f]/20";
const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-amber-50/55";

const sectionLabels: Record<PageSectionKind, string> = {
  hero: "Hero",
  about: "About",
  research: "Research Fields",
  awards: "Awards",
  regulations: "Regulations",
  milestones: "Milestones",
  news: "News",
  publications: "Publications Preview",
  workshops: "Workshop",
  footer: "Footer",
};

const getNewsTime = (item: NewsRecord) => {
  const date = new Date(item.date || item.createdAt || item.updatedAt || "");
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const formatNewsDate = (dateValue: string) => {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? "No date" : dateFormatter.format(date);
};

const listToText = (items: string[]) => items.join("\n");

const textToList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const imagesToText = (items: PageImageItem[]) =>
  items.map((item) => `${item.url}|${item.alt}`).join("\n");

const textToImages = (value: string): PageImageItem[] =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item, index) => {
      const [url, ...altParts] = item.split("|");
      return {
        id: index + 1,
        url: url.trim(),
        alt: altParts.join("|").trim(),
      };
    })
    .filter((item) => item.url);

const isHexColor = (value: string) =>
  /^#[0-9A-Fa-f]{6}$/.test(value.trim());

const AdminPage = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();
  const [content, setContent] = useState<EditableContent | null>(null);
  const [news, setNews] = useState<NewsRecord[]>([]);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRestoringVersion, setIsRestoringVersion] = useState(false);
  const [isSaveBarVisible, setIsSaveBarVisible] = useState(false);
  const [contentError, setContentError] = useState("");
  const [newsError, setNewsError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [versions, setVersions] = useState<ContentVersionSummary[]>([]);
  const [versionsError, setVersionsError] = useState("");
  const [selectedVersion, setSelectedVersion] =
    useState<ContentVersionSummary | null>(null);
  const [versionToRestore, setVersionToRestore] =
    useState<ContentVersionSummary | null>(null);
  const [versionDiff, setVersionDiff] = useState<VersionDiffItem[]>([]);
  const [versionDiffError, setVersionDiffError] = useState("");
  const [activeTab, setActiveTab] = useState<string>("layout");
  const lastScrollY = useRef(0);

  const latestNews = useMemo(
    () => [...news].sort((a, b) => getNewsTime(b) - getNewsTime(a)).slice(0, 5),
    [news],
  );

  const tabs = useMemo(() => {
    if (!content) return [];
    return [
      { id: "layout", label: "Page Layout" },
      ...content.layout
        .filter((s) => s.enabled)
        .map((s) => ({ id: s.id, label: sectionLabels[s.id] })),
      { id: "history", label: "History" },
    ];
  }, [content]);

  const updateContent = (updater: (current: EditableContent) => EditableContent) => {
    setContent((current) => (current ? updater(current) : current));
    setSaveMessage("");
  };

  const updateLayout = (
    updater: (layout: EditableContent["layout"]) => EditableContent["layout"],
  ) => {
    updateContent((current) => ({
      ...current,
      layout: updater(current.layout),
    }));
  };

  const moveLayoutSection = (sectionId: PageSectionKind, direction: -1 | 1) => {
    updateLayout((layout) => {
      const nextLayout = [...layout];
      const currentIndex = nextLayout.findIndex((section) => section.id === sectionId);
      const nextIndex = currentIndex + direction;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= nextLayout.length) {
        return layout;
      }

      [nextLayout[currentIndex], nextLayout[nextIndex]] = [
        nextLayout[nextIndex],
        nextLayout[currentIndex],
      ];
      return nextLayout;
    });
  };

  const setLayoutSectionEnabled = (
    sectionId: PageSectionKind,
    enabled: boolean,
  ) => {
    updateLayout((layout) =>
      layout.map((section) =>
        section.id === sectionId ? { ...section, enabled } : section,
      ),
    );
  };

  const loadVersions = async (signal?: AbortSignal) => {
    try {
      setVersionsError("");
      setVersions(await fetchContentVersions(signal));
    } catch (loadError) {
      if (signal?.aborted) return;
      setVersions([]);
      setVersionsError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load page history.",
      );
    }
  };

  const loadContent = async (
    signal?: AbortSignal,
    options: { forceRefresh?: boolean } = {},
  ) => {
    try {
      setIsContentLoading(true);
      setContentError("");
      setContent(await getPageContent(signal, options));
    } catch (loadError) {
      if (signal?.aborted) return;
      setContentError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load page content.",
      );
    } finally {
      if (!signal?.aborted) {
        setIsContentLoading(false);
      }
    }
  };

  const loadNews = async (signal?: AbortSignal) => {
    try {
      setIsNewsLoading(true);
      setNewsError("");
      setNews(await fetchAdminNews(signal));
    } catch (loadError) {
      if (signal?.aborted) return;
      setNewsError(
        loadError instanceof Error ? loadError.message : "Could not load news.",
      );
    } finally {
      if (!signal?.aborted) {
        setIsNewsLoading(false);
      }
    }
  };

  const validateCurrentContent = () => {
    const result = validatePageContentInput(content);
    if (!result.valid) {
      setContentError(Object.values(result.errors)[0] ?? "Page content is invalid.");
      return false;
    }

    return true;
  };

  const saveDraftVersion = async (label: string) => {
    if (!content) throw new Error("No page content is loaded.");
    const draft = await createContentVersion(label, content);
    await loadVersions();
    return draft;
  };

  const handleSaveDraft = async () => {
    if (!content) return;
    if (!validateCurrentContent()) return;

    try {
      setIsSaving(true);
      setContentError("");
      setSaveMessage("");
      await saveDraftVersion(`Draft ${new Date().toLocaleString()}`);
      try {
        await createDraftPage({
          slug: "homepage",
          title: "SRC2026 Homepage",
          type: "homepage",
          content,
        });
        setSaveMessage("Draft saved.");
      } catch {
        setSaveMessage(
          "Draft saved in legacy version history. New CMS page API was unavailable.",
        );
      }

      setIsEditing(false);
      setIsSaveBarVisible(false);
    } catch (draftError) {
      setContentError(
        draftError instanceof Error
          ? draftError.message
          : "Could not save draft.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!content) return;
    if (!validateCurrentContent()) return;

    try {
      setIsPublishing(true);
      setContentError("");
      setSaveMessage("");

      const savedContent = await updatePageContent(content);
      setContent(savedContent);
      await createContentVersion(`Published ${new Date().toLocaleString()}`, savedContent);
      await loadVersions();

      setSaveMessage(
        "Content published through the legacy live endpoint. CMS publish endpoint can be used after selecting a CMS page draft.",
      );
      setIsEditing(false);
      setIsSaveBarVisible(false);
    } catch (publishError) {
      setContentError(
        publishError instanceof Error
          ? publishError.message
          : "Could not publish page content.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCmsAction = async (
    action: "submit-review" | "publish" | "archive",
  ) => {
    if (!content) return;
    if (!validateCurrentContent()) return;

    try {
      setIsSaving(true);
      setContentError("");
      setSaveMessage("");
      const draft = await createDraftPage({
        slug: "homepage",
        title: "SRC2026 Homepage",
        type: "homepage",
        content,
      });

      if (action === "submit-review") {
        await submitPageForReview(draft.id);
        setSaveMessage("CMS draft submitted for review.");
      } else if (action === "publish") {
        await publishPage(draft.id);
        setSaveMessage("CMS draft published.");
      } else {
        await archivePage(draft.id);
        setSaveMessage("CMS draft archived.");
      }
    } catch (actionError) {
      setContentError(
        actionError instanceof Error
          ? `${actionError.message}. The legacy editor is still available.`
          : "CMS action failed.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!content) return;
    window.sessionStorage.setItem("resfes-page-preview", JSON.stringify(content));
    window.open("/?preview=local", "_blank", "noopener,noreferrer");
  };

  const handleCompareVersion = async (version: ContentVersionSummary) => {
    try {
      setVersionDiffError("");
      setVersionDiff(await getPageVersionDiff("legacy-homepage", version.id));
    } catch (diffError) {
      setVersionDiff([]);
      setVersionDiffError(
        diffError instanceof Error ? diffError.message : "Could not compare version.",
      );
    }
  };

  const handleRestoreVersion = async () => {
    if (!versionToRestore) return;

    try {
      setIsRestoringVersion(true);
      setVersionsError("");
      await restorePageVersionAsDraft("legacy-homepage", versionToRestore.id);
      await loadVersions();
      setSaveMessage("Version restored as draft. Live content was not changed.");
      setVersionToRestore(null);
    } catch (restoreError) {
      setVersionsError(
        restoreError instanceof Error
          ? restoreError.message
          : "Could not restore version.",
      );
    } finally {
      setIsRestoringVersion(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadContent(controller.signal);
    void loadNews(controller.signal);
    void loadVersions(controller.signal);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setIsSaveBarVisible(false);
      return;
    }

    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isNearBottom =
        window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 24;

      if (currentScrollY > lastScrollY.current + 8 || isNearBottom) {
        setIsSaveBarVisible(true);
      } else if (currentScrollY < lastScrollY.current - 8) {
        setIsSaveBarVisible(false);
      }

      lastScrollY.current = Math.max(0, currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isEditing]);

  if (isUserLoading) {
    return <LoadingPage label="Checking login status" />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isContentLoading || isNewsLoading) {
    return <LoadingPage label="Loading admin content" />;
  }

  const renderEditableSection = (sectionId: PageSectionKind) => {
    if (!content) return null;

    switch (sectionId) {
      case "hero":
        return (
          <HeroSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "about":
        return (
          <AboutSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "research":
        return (
          <ResearchSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "awards":
        return (
          <AwardsSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "regulations":
        return (
          <RegulationsSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "milestones":
        return (
          <MilestonesSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "news":
        return (
          <AdminSection
            title="News"
            action={
              <button
                type="button"
                onClick={() => navigate("/admin/news")}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-50/25 px-3 py-2 text-sm font-semibold cursor-pointer text-amber-50 transition hover:border-[#ff6a1f] hover:bg-amber-50/10"
              >
                Manage news
                <FaArrowRight />
              </button>
            }
          >
            {newsError ? <ErrorMessage>{newsError}</ErrorMessage> : null}
            <NewsList news={latestNews} />
          </AdminSection>
        );
      case "publications":
        return (
          <PublicationsPreviewSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "workshops":
        return (
          <WorkshopSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      case "footer":
        return (
          <FooterSection
            content={content}
            isEditing={isEditing}
            updateContent={updateContent}
          />
        );
      default:
        return null;
    }
  };

  const pageTitle = tabs.find((tab) => tab.id === activeTab)?.label || "Layout";

  const pageActions = (
    <div className="mb-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => {
          void loadContent(undefined, { forceRefresh: true });
          void loadNews();
          setIsEditing(false);
          setIsSaveBarVisible(false);
        }}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition-all hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
      >
        <FaRotateRight className="text-amber-50/70" />
        Refresh
      </button>
      <button
        type="button"
        disabled={!content}
        onClick={handlePreview}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition-all hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10 disabled:opacity-40"
      >
        <FaEye />
        Preview
      </button>
      <button
        type="button"
        disabled={!content || isSaving}
        onClick={() => void handleCmsAction("submit-review")}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition-all hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10 disabled:opacity-40"
      >
        <FaFileLines />
        Submit Review
      </button>
      <button
        type="button"
        disabled={!content || isPublishing}
        onClick={() => void handlePublish()}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff6a1f] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#e85f1b] disabled:opacity-40"
      >
        <FaRocket />
        {isPublishing ? "Publishing..." : "Publish"}
      </button>
      <button
        type="button"
        onClick={() => {
          setIsEditing((value) => {
            const nextValue = !value;
            setIsSaveBarVisible(nextValue);
            return nextValue;
          });
        }}
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 ${
          isEditing
            ? "border border-zinc-600 bg-zinc-800 hover:bg-zinc-700"
            : "border border-transparent bg-gradient-to-r from-[#ff6a1f] to-[#e85f1b] hover:shadow-[#ff6a1f]/30"
        }`}
      >
        {isEditing ? <FaXmark /> : <FaPen />}
        {isEditing ? "Stop Editing" : "Edit Content"}
      </button>
    </div>
  );

  return (
    <AdminLayout
      description="Review and update public page content."
      title={pageTitle}
    >
      {pageActions}
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-amber-50/10 bg-black/45 p-3">
            <p className="mb-3 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-50/35">
              Sections
            </p>
            <nav className="grid gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg border-l-2 px-3 py-2 text-left text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "border-[#ff6a1f] bg-gradient-to-r from-[#ff6a1f]/10 to-transparent font-semibold text-[#ff6a1f]"
                      : "border-transparent text-amber-50/60 hover:bg-amber-50/5 hover:text-amber-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 pb-24">
          {contentError ? <ErrorMessage>{contentError}</ErrorMessage> : null}
          {saveMessage ? <SuccessMessage>{saveMessage}</SuccessMessage> : null}

          {content ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
              {activeTab === "layout" && (
                <LayoutSection
                  content={content}
                  isEditing={isEditing}
                  onAdd={(sectionId) => setLayoutSectionEnabled(sectionId, true)}
                  onMove={moveLayoutSection}
                  onRemove={(sectionId) => setLayoutSectionEnabled(sectionId, false)}
                  onUpdateSectionStyle={(sectionId, updates) =>
                    updateContent((current) => ({
                      ...current,
                      sectionStyles: current.sectionStyles.map((style) =>
                        style.id === sectionId ? { ...style, ...updates } : style,
                      ),
                    }))
                  }
                />
              )}
              {activeTab === "history" && (
                <HistorySection
                  diff={versionDiff}
                  diffError={versionDiffError}
                  error={versionsError}
                  onCompareVersion={(version) => void handleCompareVersion(version)}
                  onRestoreVersion={setVersionToRestore}
                  onSelectVersion={setSelectedVersion}
                  selectedVersion={selectedVersion}
                  versions={versions}
                />
              )}
              {activeTab !== "layout" &&
                activeTab !== "history" &&
                renderEditableSection(activeTab as PageSectionKind)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-b-[#ff6a1f]/30 border-l-transparent border-r-transparent border-t-[#ff6a1f]" />
              <p className="text-sm font-medium text-amber-50/60">
                Waiting for page content...
              </p>
            </div>
          )}
        </div>
      </div>

      {content ? (
        <SaveBar
          isSaving={isSaving}
          isVisible={isSaveBarVisible}
          onSave={() => void handleSaveDraft()}
        />
      ) : null}
      <VersionRestoreDialog
        isRestoring={isRestoringVersion}
        onClose={() => setVersionToRestore(null)}
        onConfirm={() => void handleRestoreVersion()}
        version={versionToRestore}
      />
    </AdminLayout>
  );
};

type ContentUpdater = (updater: (current: EditableContent) => EditableContent) => void;

type EditableSectionProps = {
  content: EditableContent;
  isEditing: boolean;
  updateContent: ContentUpdater;
};

type LayoutSectionProps = {
  content: EditableContent;
  isEditing: boolean;
  onAdd: (sectionId: PageSectionKind) => void;
  onMove: (sectionId: PageSectionKind, direction: -1 | 1) => void;
  onRemove: (sectionId: PageSectionKind) => void;
  onUpdateSectionStyle: (
    sectionId: PageSectionKind,
    updates: Partial<Omit<PageSectionStyle, "id">>,
  ) => void;
};

const LayoutSection = ({
  content,
  isEditing,
  onAdd,
  onMove,
  onRemove,
  onUpdateSectionStyle,
}: LayoutSectionProps) => {
  const enabledSections = content.layout.filter((section) => section.enabled);
  const disabledSections = content.layout.filter((section) => !section.enabled);

  return (
    <AdminSection title="Page Layout">
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <ContentCard>
          <ul className="list">
            {enabledSections.map((section, index) => (
              <li
                key={section.id}
                className="list-row border-b border-amber-50/10 last:border-b-0"
              >
                <div className="list-col-grow">
                  <div className="font-semibold text-amber-50">
                    {sectionLabels[section.id]}
                  </div>
                  <div className="text-xs text-amber-50/45">
                    Position {index + 1}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <ColorField
                      isEditing={isEditing}
                      label="Background"
                      value={getSectionStyle(content.sectionStyles, section.id).backgroundColor}
                      onChange={(value) =>
                        onUpdateSectionStyle(section.id, { backgroundColor: value })
                      }
                    />
                    <ColorField
                      isEditing={isEditing}
                      label="Text"
                      value={getSectionStyle(content.sectionStyles, section.id).textColor}
                      onChange={(value) =>
                        onUpdateSectionStyle(section.id, { textColor: value })
                      }
                    />
                    <ColorField
                      isEditing={isEditing}
                      label="Accent"
                      value={getSectionStyle(content.sectionStyles, section.id).accentColor}
                      onChange={(value) =>
                        onUpdateSectionStyle(section.id, { accentColor: value })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    disabled={!isEditing || index === 0}
                    onClick={() => onMove(section.id, -1)}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    disabled={!isEditing || index === enabledSections.length - 1}
                    onClick={() => onMove(section.id, 1)}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-red-200"
                    disabled={!isEditing}
                    onClick={() => onRemove(section.id)}
                  >
                    <FaTrash className="size-3" />
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </ContentCard>

        <ContentCard>
          <div className="flex items-center gap-2">
            <FaPlus className="text-[#ff6a1f]" />
            <h3 className="font-semibold">Add section</h3>
          </div>
          {disabledSections.length === 0 ? (
            <p className="mt-4 text-sm text-amber-50/55">
              All page sections are active.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {disabledSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="btn btn-outline btn-sm border-amber-50/25 text-amber-50"
                  disabled={!isEditing}
                  onClick={() => onAdd(section.id)}
                >
                  <FaPlus className="size-3" />
                  {sectionLabels[section.id]}
                </button>
              ))}
            </div>
          )}
          {!isEditing ? (
            <p className="mt-4 text-xs text-amber-50/40">
              Enable edit mode to change the page layout.
            </p>
          ) : null}
        </ContentCard>
      </div>
    </AdminSection>
  );
};

type HistorySectionProps = {
  diff: VersionDiffItem[];
  diffError: string;
  error: string;
  onCompareVersion: (version: ContentVersionSummary) => void;
  onRestoreVersion: (version: ContentVersionSummary) => void;
  onSelectVersion: (version: ContentVersionSummary) => void;
  selectedVersion: ContentVersionSummary | null;
  versions: ContentVersionSummary[];
};

const HistorySection = ({
  diff,
  diffError,
  error,
  onCompareVersion,
  onRestoreVersion,
  onSelectVersion,
  selectedVersion,
  versions,
}: HistorySectionProps) => (
  <AdminSection title="History">
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <ContentCard>
        <div className="flex items-center gap-2">
          <FaClockRotateLeft className="text-[#ff6a1f]" />
          <h3 className="font-semibold">Saved versions</h3>
        </div>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
        {!error && versions.length === 0 ? (
          <p className="mt-4 text-sm text-amber-50/55">
            No saved page versions were returned by the database.
          </p>
        ) : (
          <div className="mt-4 grid gap-2">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`min-w-0 rounded-lg border border-amber-50/15 bg-zinc-950 p-2 ${selectedVersion?.id === version.id ? "border-[#ff6a1f]" : ""}`}
              >
                <button
                  type="button"
                  className="flex w-full min-w-0 items-center gap-2 text-left text-sm text-amber-50"
                  onClick={() => onSelectVersion(version)}
                >
                  <FaEye className="size-4 shrink-0" />
                  <span className="block min-w-0 flex-1 truncate">
                    {version.label}
                  </span>
                </button>
                <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-xs border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10"
                    onClick={() => onCompareVersion(version)}
                  >
                    Compare
                  </button>
                  <button
                    type="button"
                    className="btn btn-xs border-amber-50/15 bg-transparent text-amber-50 hover:border-[#ff6a1f] hover:bg-amber-50/10"
                    onClick={() => onRestoreVersion(version)}
                  >
                    Restore draft
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ContentCard>

      <ContentCard>
        {selectedVersion ? (
          <div className="grid gap-6">
            <VersionPreview version={selectedVersion} />
            {diffError ? <ErrorMessage>{diffError}</ErrorMessage> : null}
            <VersionDiffViewer diff={diff} />
          </div>
        ) : (
          <p className="text-sm text-amber-50/55">
            Select a saved version to view a previous competition page layout.
          </p>
        )}
      </ContentCard>
    </div>
  </AdminSection>
);

const VersionPreview = ({ version }: { version: ContentVersionSummary }) => {
  const content = version.content;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="badge badge-outline border-[#ff6a1f] text-[#ff6a1f]">
          {new Date(version.createdAt).toLocaleString()}
        </span>
        <h3 className="min-w-0 break-words text-lg font-semibold">
          {version.label}
        </h3>
      </div>
      {content ? (
        <div className="mt-5 grid gap-5">
          <div>
            <p className={labelClass}>Section order</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {content.layout
                .filter((section) => section.enabled)
                .map((section) => (
                  <span key={section.id} className="badge badge-ghost">
                    {sectionLabels[section.id]}
                  </span>
                ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <ReadOnlyMetric label="Hero" value={content.hero.titleLines.join(" ")} />
            <ReadOnlyMetric label="About" value={content.about.title} />
            <ReadOnlyMetric label="Research Fields" value={String(content.researchFields.length)} />
            <ReadOnlyMetric label="Milestones" value={String(content.milestones.length)} />
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-amber-50/55">
          This version did not include an inspectable content snapshot.
        </p>
      )}
    </div>
  );
};

const ReadOnlyMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded border border-amber-50/10 bg-black p-3">
    <p className={labelClass}>{label}</p>
    <p className="mt-1 line-clamp-2 text-sm text-amber-50/80">{value}</p>
  </div>
);

const HeroSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Hero">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        <EditableListField
          isEditing={isEditing}
          label="Title lines"
          value={content.hero.titleLines}
          onChange={(value) =>
            updateContent((current) => ({
              ...current,
              hero: { ...current.hero, titleLines: value },
            }))
          }
        />
        <EditableField
          isEditing={isEditing}
          label="Background image URL"
          value={content.hero.backgroundImageUrl}
          onChange={(value) =>
            updateContent((current) => ({
              ...current,
              hero: { ...current.hero, backgroundImageUrl: value },
            }))
          }
        />
        <EditableField
          isEditing={isEditing}
          label="Registration deadline"
          value={content.hero.registrationDeadline}
          onChange={(value) =>
            updateContent((current) => ({
              ...current,
              hero: { ...current.hero, registrationDeadline: value },
            }))
          }
        />
        {(["taglinePrimary", "taglineSecondary", "countdownLabel", "ctaLabel", "ctaUrl", "partnerLabel", "closingLinePrimary", "closingLineSecondary"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content.hero[field]}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                hero: { ...current.hero, [field]: value },
              }))
            }
          />
        ))}
        <div className="md:col-span-2">
          <ImageListField
            isEditing={isEditing}
            label="Partner logos"
            value={content.hero.partnerLogos}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                hero: { ...current.hero, partnerLogos: value },
              }))
            }
          />
        </div>
      </div>
    </ContentCard>
  </AdminSection>
);

const AboutSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="About">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        {(["sectionLabel", "title", "highlightOne", "highlightTwo"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content.about[field]}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                about: { ...current.about, [field]: value },
              }))
            }
          />
        ))}
        <div className="md:col-span-2">
          <ImageListField
            isEditing={isEditing}
            label="Carousel images"
            value={content.about.images}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                about: { ...current.about, images: value },
              }))
            }
          />
        </div>
        {(["paragraphOne", "paragraphTwo", "paragraphThree"] as const).map((field) => (
          <div key={field} className="md:col-span-2">
            <EditableField
              isEditing={isEditing}
              label={field}
              textarea
              value={content.about[field]}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  about: { ...current.about, [field]: value },
                }))
              }
            />
          </div>
        ))}
      </div>
    </ContentCard>
  </AdminSection>
);

const ResearchSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Research Fields">
    <ContentCard>
      <EditableField
        isEditing={isEditing}
        label="Section title"
        value={content.researchTitle}
        onChange={(value) =>
          updateContent((current) => ({ ...current, researchTitle: value }))
        }
      />
    </ContentCard>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      {content.researchFields.map((item) => (
        <ResearchFieldCard
          key={item.id}
          item={item}
          isEditing={isEditing}
          updateContent={updateContent}
        />
      ))}
    </div>
  </AdminSection>
);

const ResearchFieldCard = ({
  item,
  isEditing,
  updateContent,
}: {
  item: ResearchFieldItem;
  isEditing: boolean;
  updateContent: ContentUpdater;
}) => {
  const updateItem = (
    updater: (item: ResearchFieldItem) => ResearchFieldItem,
  ) => {
    updateContent((current) => ({
      ...current,
      researchFields: current.researchFields.map((field) =>
        field.id === item.id ? updater(field) : field,
      ),
    }));
  };

  return (
    <ContentCard>
      <div className="grid gap-3">
        <EditableField
          isEditing={isEditing}
          label="Title"
          value={item.title}
          onChange={(value) => updateItem((field) => ({ ...field, title: value }))}
        />
        <IconSelectField
          isEditing={isEditing}
          label="Icon"
          value={item.icon}
          onChange={(value) =>
            updateItem((field) => ({
              ...field,
              icon: value,
            }))
          }
        />
        <EditableListField
          isEditing={isEditing}
          label="Accordion items"
          value={item.accordionItems}
          onChange={(value) =>
            updateItem((field) => ({ ...field, accordionItems: value }))
          }
        />
        <EditableListField
          isEditing={isEditing}
          label="Carousel items"
          value={item.carouselItems}
          onChange={(value) =>
            updateItem((field) => ({ ...field, carouselItems: value }))
          }
        />
      </div>
    </ContentCard>
  );
};

const AwardsSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Awards">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-3">
        {(["awardsTitle", "awardsStandardLabel", "awardsSmallLabel"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content[field]}
            onChange={(value) =>
              updateContent((current) => ({ ...current, [field]: value }))
            }
          />
        ))}
      </div>
      <div className="mt-4">
        <EditableField
          isEditing={isEditing}
          label="Awards note"
          textarea
          value={content.awardsNote}
          onChange={(value) =>
            updateContent((current) => ({ ...current, awardsNote: value }))
          }
        />
      </div>
    </ContentCard>
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      {content.awards.map((award) => (
        <AwardCard
          key={award.id}
          award={award}
          isEditing={isEditing}
          updateContent={updateContent}
        />
      ))}
    </div>
  </AdminSection>
);

const AwardCard = ({
  award,
  isEditing,
  updateContent,
}: {
  award: AwardCommittee;
  isEditing: boolean;
  updateContent: ContentUpdater;
}) => {
  const updateAward = (updater: (award: AwardCommittee) => AwardCommittee) => {
    updateContent((current) => ({
      ...current,
      awards: current.awards.map((item) =>
        item.id === award.id ? updater(item) : item,
      ),
    }));
  };

  return (
    <ContentCard>
      <div className="grid gap-3">
        <EditableField
          isEditing={isEditing}
          label="Name"
          value={award.name}
          onChange={(value) => updateAward((item) => ({ ...item, name: value }))}
        />
        <EditableField
          isEditing={isEditing}
          label="Vietnamese name"
          value={award.nameVi}
          onChange={(value) => updateAward((item) => ({ ...item, nameVi: value }))}
        />
        <AwardTierFields
          isEditing={isEditing}
          label="Standard awards"
          tiers={award.standardAwards}
          onChange={(tiers) =>
            updateAward((item) => ({ ...item, standardAwards: tiers }))
          }
        />
        <AwardTierFields
          isEditing={isEditing}
          label="Small awards"
          tiers={award.smallAwards}
          onChange={(tiers) =>
            updateAward((item) => ({ ...item, smallAwards: tiers }))
          }
        />
      </div>
    </ContentCard>
  );
};

const AwardTierFields = ({
  isEditing,
  label,
  onChange,
  tiers,
}: {
  isEditing: boolean;
  label: string;
  onChange: (tiers: AwardTier[]) => void;
  tiers: AwardTier[];
}) => (
  <div>
    <p className={labelClass}>{label}</p>
    <div className="mt-2 grid gap-2">
      {tiers.map((tier) => (
        <div key={tier.id} className="grid gap-2 rounded border border-amber-50/10 p-3 md:grid-cols-2">
          <EditableField
            isEditing={isEditing}
            label="Label"
            value={tier.label}
            onChange={(value) =>
              onChange(tiers.map((item) => (item.id === tier.id ? { ...item, label: value } : item)))
            }
          />
          <EditableField
            isEditing={isEditing}
            label="Amount"
            value={tier.amount}
            onChange={(value) =>
              onChange(tiers.map((item) => (item.id === tier.id ? { ...item, amount: value } : item)))
            }
          />
        </div>
      ))}
    </div>
  </div>
);

const RegulationsSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Regulations">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        <EditableField
          isEditing={isEditing}
          label="Section title"
          value={content.regulationsTitle}
          onChange={(value) =>
            updateContent((current) => ({ ...current, regulationsTitle: value }))
          }
        />
        <EditableField
          isEditing={isEditing}
          label="Subtitle"
          value={content.regulationsSubtitle}
          onChange={(value) =>
            updateContent((current) => ({
              ...current,
              regulationsSubtitle: value,
            }))
          }
        />
      </div>
    </ContentCard>
    <div className="mt-4 grid gap-4">
      {content.regulations.map((item) => (
        <RegulationCard
          key={item.id}
          item={item}
          isEditing={isEditing}
          updateContent={updateContent}
        />
      ))}
    </div>
  </AdminSection>
);

const RegulationCard = ({
  item,
  isEditing,
  updateContent,
}: {
  item: RegulationSection;
  isEditing: boolean;
  updateContent: ContentUpdater;
}) => {
  const updateItem = (updater: (item: RegulationSection) => RegulationSection) => {
    updateContent((current) => ({
      ...current,
      regulations: current.regulations.map((regulation) =>
        regulation.id === item.id ? updater(regulation) : regulation,
      ),
    }));
  };

  return (
    <ContentCard>
      <div className="grid gap-3">
        <EditableField
          isEditing={isEditing}
          label="Title"
          value={item.title}
          onChange={(value) => updateItem((current) => ({ ...current, title: value }))}
        />
        <EditableListField
          isEditing={isEditing}
          label="Rules"
          value={item.items}
          onChange={(value) => updateItem((current) => ({ ...current, items: value }))}
        />
      </div>
    </ContentCard>
  );
};

const MilestonesSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Milestones">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        <EditableField
          isEditing={isEditing}
          label="Section title"
          value={content.milestonesTitle}
          onChange={(value) =>
            updateContent((current) => ({ ...current, milestonesTitle: value }))
          }
        />
        <EditableField
          isEditing={isEditing}
          label="Note"
          textarea
          value={content.milestonesNote}
          onChange={(value) =>
            updateContent((current) => ({ ...current, milestonesNote: value }))
          }
        />
      </div>
    </ContentCard>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {content.milestones.map((item) => (
        <ContentCard key={item.id}>
          <div className="grid gap-3">
            <EditableField
              isEditing={isEditing}
              label="Date"
              value={item.date}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  milestones: current.milestones.map((milestone) =>
                    milestone.id === item.id ? { ...milestone, date: value } : milestone,
                  ),
                }))
              }
            />
            <EditableField
              isEditing={isEditing}
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  milestones: current.milestones.map((milestone) =>
                    milestone.id === item.id ? { ...milestone, title: value } : milestone,
                  ),
                }))
              }
            />
            <EditableField
              isEditing={isEditing}
              label="Detail"
              value={item.detail ?? ""}
              onChange={(value) =>
                updateContent((current) => ({
                  ...current,
                  milestones: current.milestones.map((milestone) =>
                    milestone.id === item.id ? { ...milestone, detail: value || undefined } : milestone,
                  ),
                }))
              }
            />
          </div>
        </ContentCard>
      ))}
    </div>
  </AdminSection>
);

const PublicationsPreviewSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Publications Preview">
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        {(["eyebrow", "badge", "readMoreLabel", "viewAllLabel"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content.publicationsHome[field]}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                publicationsHome: { ...current.publicationsHome, [field]: value },
              }))
            }
          />
        ))}
      </div>
    </ContentCard>
  </AdminSection>
);

const WorkshopSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Workshop">
    <div className="grid gap-4">
      {content.workshops.map((item) => (
        <WorkshopCard
          key={item.id}
          item={item}
          isEditing={isEditing}
          updateContent={updateContent}
        />
      ))}
    </div>
  </AdminSection>
);

const WorkshopCard = ({
  item,
  isEditing,
  updateContent,
}: {
  item: WorkshopItem;
  isEditing: boolean;
  updateContent: ContentUpdater;
}) => {
  const updateItem = (updater: (item: WorkshopItem) => WorkshopItem) => {
    updateContent((current) => ({
      ...current,
      workshops: current.workshops.map((workshop) =>
        workshop.id === item.id ? updater(workshop) : workshop,
      ),
    }));
  };

  return (
    <ContentCard>
      <div className="grid gap-3 md:grid-cols-2">
        {(["eyebrow", "title", "backgroundImageUrl", "scheduleLabel", "date", "note", "sessionTitle", "sessionSubtitle", "time"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={item[field]}
            onChange={(value) =>
              updateItem((workshop) => ({ ...workshop, [field]: value }))
            }
          />
        ))}
        <div className="md:col-span-2">
          <EditableField
            isEditing={isEditing}
            label="Description"
            textarea
            value={item.description}
            onChange={(value) =>
              updateItem((workshop) => ({ ...workshop, description: value }))
            }
          />
        </div>
      </div>
    </ContentCard>
  );
};

const FooterSection = ({ content, isEditing, updateContent }: EditableSectionProps) => (
  <AdminSection title="Footer">
    <ContentCard>
      <div className="grid gap-3 mb-12 md:grid-cols-2">
        {(["headlineOne", "headlineTwo", "headlineThree", "ctaLabel", "ctaUrl", "contactHeading", "facebookLabel", "facebookUrl", "emailLabel", "email", "phoneLabel", "phone", "copyrightLine", "rightsLine"] as const).map((field) => (
          <EditableField
            key={field}
            isEditing={isEditing}
            label={field}
            value={content.footer[field]}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                footer: { ...current.footer, [field]: value },
              }))
            }
            />
        ))}
        <div className="md:col-span-2">
          <ImageListField
            isEditing={isEditing}
            label="Footer logos"
            value={content.footer.logos}
            onChange={(value) =>
              updateContent((current) => ({
                ...current,
                footer: { ...current.footer, logos: value },
              }))
            }
          />
        </div>
      </div>
    </ContentCard>
  </AdminSection>
);

const NewsList = ({
  news,
}: {
  news: NewsRecord[];
}) => (
  <div className="overflow-hidden rounded-lg border border-amber-50/10 bg-zinc-900">
    <div className="grid grid-cols-[96px_1fr] gap-4 border-b border-amber-50/10 bg-black/25 px-4 py-3 text-xs font-semibold uppercase text-amber-50/45 md:grid-cols-[120px_1fr_180px_140px]">
      <span>Image</span>
      <span>Title</span>
      <span className="hidden md:block">Author</span>
      <span className="hidden md:block">Date</span>
    </div>

    {news.length === 0 ? (
      <p className="px-4 py-10 text-center text-sm text-amber-50/55">
        No news articles found.
      </p>
    ) : (
      news.map((item) => (
        <article
          key={item._id}
          className="grid grid-cols-[96px_1fr] gap-4 border-b border-amber-50/10 px-4 py-4 last:border-b-0 md:grid-cols-[120px_1fr_180px_140px] md:items-center"
        >
          {item.thumbNailImage ? (
            <img
              src={item.thumbNailImage}
              alt={item.title}
              className="h-16 w-24 rounded object-cover md:h-20 md:w-28"
            />
          ) : (
            <div className="h-16 w-24 rounded bg-black/40 md:h-20 md:w-28" />
          )}
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold text-white">
              {item.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-amber-50/55">
              {item.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-amber-50/45 md:hidden">
              <span>{item.author}</span>
              <span>{formatNewsDate(item.date)}</span>
            </div>
          </div>
          <span className="hidden text-sm text-amber-50/75 md:block">{item.author}</span>
          <span className="hidden text-sm text-amber-50/55 md:block">
            {formatNewsDate(item.date)}
          </span>
        </article>
      ))
    )}
  </div>
);

type AdminSectionProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

const AdminSection = ({ action, children, title }: AdminSectionProps) => (
  <section className="mt-8">
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

type SaveBarProps = {
  isSaving: boolean;
  isVisible: boolean;
  onSave: () => void;
};

const SaveBar = ({ isSaving, isVisible, onSave }: SaveBarProps) => (
  <div
    className={`fixed right-0 md:left-64 bottom-0 z-50 border-t border-amber-50/15 bg-black/90 px-5 py-4 backdrop-blur transition-transform duration-200 ${isVisible ? "translate-y-0" : "translate-y-full"
      }`}
  >
    <div className="mx-auto flex max-w-6xl justify-end">
      <button
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#ff6a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e85f1b] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaFloppyDisk />
        {isSaving ? "Saving..." : "Save draft"}
      </button>
    </div>
  </div>
);

const ContentCard = ({ children }: { children: ReactNode }) => (
  <div className="min-w-0 rounded-lg border border-amber-50/10 bg-zinc-900 p-4 shadow-lg">
    {children}
  </div>
);

const EditableField = ({
  isEditing,
  label,
  onChange,
  textarea = false,
  value,
}: {
  isEditing: boolean;
  label: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  value: string;
}) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    {isEditing ? (
      textarea ? (
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )
    ) : (
      <span className="text-sm leading-6 text-amber-50/80">{value || "-"}</span>
    )}
  </label>
);

const ColorField = ({
  isEditing,
  label,
  onChange,
  value,
}: {
  isEditing: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) => (
  <label className="grid min-w-0 gap-1">
    <span className={`${labelClass} whitespace-nowrap`}>{label}</span>
    {isEditing ? (
      <span className="flex min-w-0 items-center gap-2">
        <input
          aria-label={`${label} color`}
          className="h-9 w-11 shrink-0 cursor-pointer rounded border border-white/15 bg-black p-1"
          type="color"
          value={isHexColor(value) ? value : "#000000"}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          className={`${inputClass} min-w-0`}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    ) : (
      <span className="flex min-w-0 items-center gap-2 text-sm leading-6 text-amber-50/80">
        <span
          className="inline-block h-4 w-4 shrink-0 rounded border border-white/20"
          style={{ backgroundColor: value }}
        />
        <span className="min-w-0 truncate">{value || "-"}</span>
      </span>
    )}
  </label>
);

const IconSelectField = ({
  isEditing,
  label,
  onChange,
  value,
}: {
  isEditing: boolean;
  label: string;
  onChange: (value: ResearchFieldItem["icon"]) => void;
  value: ResearchFieldItem["icon"];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = researchIconOptions.find((option) => option.value === value);
  const Icon = selected?.Icon;

  return (
    <div className="relative grid gap-1">
      <span className={labelClass}>{label}</span>
      {isEditing ? (
        <div
          className="relative"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsOpen(false);
            }
          }}
        >
          <button
            type="button"
            className={`${inputClass} flex items-center justify-between gap-3 text-left`}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            <span className="inline-flex min-w-0 items-center gap-2">
              {Icon ? <Icon className="shrink-0 text-[#ff6a1f]" /> : null}
              <span className="truncate">{selected?.label ?? value}</span>
            </span>
            <FaChevronDown
              className={`shrink-0 text-amber-50/45 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isOpen ? (
            <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-white/15 bg-zinc-950 p-1 shadow-xl">
              {researchIconOptions.map((option) => {
                const OptionIcon = option.Icon;
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? "bg-[#ff6a1f]/15 text-[#ff6a1f]"
                        : "text-amber-50/80 hover:bg-amber-50/10 hover:text-amber-50"
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <OptionIcon className="shrink-0" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : (
        <span className="inline-flex items-center gap-2 text-sm leading-6 text-amber-50/80">
          {Icon ? <Icon className="text-[#ff6a1f]" /> : null}
          {selected?.label ?? value}
        </span>
      )}
    </div>
  );
};

const EditableListField = ({
  isEditing,
  label,
  onChange,
  value,
}: {
  isEditing: boolean;
  label: string;
  onChange: (value: string[]) => void;
  value: string[];
}) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    {isEditing ? (
      <textarea
        className={`${inputClass} min-h-28 resize-y`}
        value={listToText(value)}
        onChange={(event) => onChange(textToList(event.target.value))}
      />
    ) : (
      <span className="text-sm leading-6 text-amber-50/80">
        {value.length > 0 ? value.join(", ") : "-"}
      </span>
    )}
  </label>
);

const ImageListField = ({
  isEditing,
  label,
  onChange,
  value,
}: {
  isEditing: boolean;
  label: string;
  onChange: (value: PageImageItem[]) => void;
  value: PageImageItem[];
}) => (
  <label className="grid gap-1">
    <span className={labelClass}>{label}</span>
    {isEditing ? (
      <textarea
        className={`${inputClass} min-h-28 resize-y`}
        placeholder="https://example.com/image.jpg|Image alt text"
        value={imagesToText(value)}
        onChange={(event) => onChange(textToImages(event.target.value))}
      />
    ) : (
      <span className="text-sm leading-6 text-amber-50/80">
        {value.length > 0
          ? value.map((item) => item.alt || item.url).join(", ")
          : "-"}
      </span>
    )}
    {isEditing ? (
      <span className="text-xs text-amber-50/35">
        One image per line: URL|alt text.
      </span>
    ) : null}
  </label>
);

const ErrorMessage = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 rounded-md border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-100">
    {children}
  </div>
);

const SuccessMessage = ({ children }: { children: ReactNode }) => (
  <div className="mt-6 rounded-md border border-emerald-500/40 bg-emerald-950/50 px-4 py-3 text-sm text-emerald-100">
    {children}
  </div>
);

export default AdminPage;
