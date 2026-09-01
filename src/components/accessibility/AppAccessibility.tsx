import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeLabels: Record<string, string> = {
  "/": "SRC2026 home",
  "/mentors": "Mentors",
  "/news-list": "News",
  "/publications": "Publications",
  "/submit": "Submit research",
  "/register": "Research registration",
  "/auth/login": "Staff login",
  "/auth/signup": "Create account",
  "/admin": "Admin dashboard",
};

const getRouteLabel = (pathname: string) => {
  if (routeLabels[pathname]) return routeLabels[pathname];
  if (pathname.startsWith("/news-list/")) return "News article";
  if (pathname.startsWith("/publications/")) return "Publication detail";
  if (pathname === "/submit/publication") return "Publication submission";
  if (pathname === "/submit/mentor") return "Mentor submission";
  if (pathname.startsWith("/admin")) return "Admin workspace";
  return "SRC2026 page";
};

const AppAccessibility = () => {
  const { pathname } = useLocation();
  const label = getRouteLabel(pathname);

  useEffect(() => {
    document.title = `${label} | SRC2026`;
  }, [label]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Navigated to {label}
      </div>
    </>
  );
};

export default AppAccessibility;
