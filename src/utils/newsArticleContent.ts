export type NewsArticleTextBlock = {
  id: string;
  type: "paragraph" | "heading" | "quote";
  text: string;
};

export type NewsArticleImageBlock = {
  id: string;
  type: "image";
  url: string;
  alt: string;
  caption: string;
};

export type NewsArticleBlock = NewsArticleTextBlock | NewsArticleImageBlock;

type StoredTextBlock = Omit<NewsArticleTextBlock, "id">;
type StoredImageBlock = {
  type: "image";
  imageIndex: number;
  alt?: string;
  caption?: string;
};

export type StoredNewsArticleBlock = StoredTextBlock | StoredImageBlock;

type StoredNewsArticle = {
  version: 1;
  blocks: StoredNewsArticleBlock[];
};

const ARTICLE_PREFIX = "__RESFES_NEWS_BLOCKS_V1__";

let fallbackId = 0;

export const createNewsBlockId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  fallbackId += 1;
  return `news-block-${Date.now()}-${fallbackId}`;
};

const isTextBlockType = (
  value: unknown,
): value is NewsArticleTextBlock["type"] =>
  value === "paragraph" || value === "heading" || value === "quote";

const parseStoredArticle = (value: string): StoredNewsArticle | null => {
  if (!value.startsWith(ARTICLE_PREFIX)) return null;

  try {
    const parsed = JSON.parse(value.slice(ARTICLE_PREFIX.length)) as Partial<StoredNewsArticle>;
    if (parsed.version !== 1 || !Array.isArray(parsed.blocks)) return null;
    return parsed as StoredNewsArticle;
  } catch {
    return null;
  }
};

export const serializeNewsArticle = (blocks: StoredNewsArticleBlock[]) =>
  `${ARTICLE_PREFIX}${JSON.stringify({ version: 1, blocks } satisfies StoredNewsArticle)}`;

export const parseNewsArticle = (
  value: string | null | undefined,
  images: string[] = [],
): { blocks: NewsArticleBlock[]; isStructured: boolean } => {
  const stored = parseStoredArticle(value || "");

  if (stored) {
    const blocks = stored.blocks.flatMap<NewsArticleBlock>((block) => {
      if (block.type !== "image" && isTextBlockType(block.type) && typeof block.text === "string") {
        return [{ id: createNewsBlockId(), type: block.type, text: block.text }];
      }

      if (
        block.type === "image" &&
        Number.isInteger(block.imageIndex) &&
        block.imageIndex >= 0 &&
        typeof images[block.imageIndex] === "string"
      ) {
        return [
          {
            id: createNewsBlockId(),
            type: "image",
            url: images[block.imageIndex],
            alt: typeof block.alt === "string" ? block.alt : "",
            caption: typeof block.caption === "string" ? block.caption : "",
          },
        ];
      }

      return [];
    });

    return { blocks, isStructured: true };
  }

  const textBlocks: NewsArticleBlock[] = (value || "")
    .split(/\r?\n\s*\r?\n/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({ id: createNewsBlockId(), type: "paragraph", text }));

  return {
    blocks: [
      ...textBlocks,
      ...images.map<NewsArticleImageBlock>((url) => ({
        id: createNewsBlockId(),
        type: "image",
        url,
        alt: "",
        caption: "",
      })),
    ],
    isStructured: false,
  };
};
