import { useEffect, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useUser } from "../../hook/useUser";
import { hasPermission } from "../../config/permissions";

const listItem = [
  {
    href: "/#about",
    label: "About",
  },
  {
    href: "/#research-fields",
    label: "Research Fields",
  },
  {
    href: "/#awards",
    label: "Awards",
  },
  {
    href: "/#regulations",
    label: "Regulations",
  },
  {
    href: "/#milestones",
    label: "Milestones",
  },
  {
    href: "/#workshops",
    label: "Workshops",
  },
  {
    href: "/publications",
    label: "Publications",
  },
  {
    href: "/mentors",
    label: "Mentors",
  },
  {
    href: "/submit",
    label: "Submit",
  },
];

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { user, logout } = useUser();
  const canOpenAdmin = hasPermission(user?.role, "dashboard.read");
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        id="mobile-navigation"
        className="fixed right-0 top-0 z-50 h-dvh w-80 max-w-[85vw] bg-black text-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span id="mobile-navigation-title" className="text-sm font-semibold tracking-wide">Menu</span>
          <button
            ref={closeButtonRef}
            type="button"
            className="btn btn-ghost btn-sm text-white!"
            onClick={onClose}
            aria-label="Close menu"
          >
            <RxCross2 aria-hidden="true" size={22} />
          </button>
        </div>

        <ul className="menu menu-vertical gap-1 p-4 [&>li>a]:text-white!">
          {listItem.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={onClose}>
                {item.label}
              </a>
            </li>
          ))}
          {user && (
            <>
              {canOpenAdmin && (
                <li>
                  <a href="/admin" onClick={onClose}>Admin</a>
                </li>
              )}
              <li>
                <button type="button" onClick={() => void logout().then(onClose)}>
                  <FaArrowRightFromBracket aria-hidden="true" />
                  Sign out
                </button>
              </li>
            </>
          )}
          {!user && <li><a href="/auth/login" onClick={onClose}>Login</a></li>}
        </ul>
      </aside>
    </>
  );
};

export default MobileMenu;
