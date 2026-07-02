import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminNavigation } from "../../config/adminNavigation";
import { usePermissions } from "../../hook/usePermissions";

const AdminLayout = ({
  children,
  description = "Manage SRC2026 content and operations.",
  title = "Admin",
}: {
  children: ReactNode;
  description?: string;
  title?: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const visibleItems = adminNavigation.filter((item) => can(item.permission));

  return (
    <main className="flex min-h-screen w-full bg-[#050505] font-sans text-amber-50">
      <aside className="z-20 flex w-64 flex-shrink-0 flex-col overflow-y-auto border-r border-amber-50/10 bg-black shadow-2xl shadow-black">
        <div className="border-b border-amber-50/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6a1f]">
            Admin
          </p>
          <h1 className="mt-1 bg-gradient-to-r from-amber-50 to-amber-500 bg-clip-text text-2xl font-bold text-transparent">
            <Link to="/">SRC2026</Link>
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-amber-50/50">
            {description}
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.path === "/admin"
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border-l-2 px-4 py-3 text-left text-sm transition-all duration-300 ${
                  active
                    ? "border-[#ff6a1f] bg-gradient-to-r from-[#ff6a1f]/10 to-transparent font-semibold text-[#ff6a1f]"
                    : "border-transparent text-amber-50/60 hover:bg-amber-50/5 hover:text-amber-50"
                }`}
              >
                <Icon className="shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-amber-50/5 bg-[#0a0a0a]/80 px-6 py-4 shadow-sm backdrop-blur-md md:px-10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#ff6a1f]" />
            <h2 className="text-lg font-medium tracking-wide text-amber-50/90">
              {title}
            </h2>
          </div>
          <Link
            to="/"
            className="rounded-lg border border-amber-50/15 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
          >
            Public site
          </Link>
        </div>

        <div className="mx-auto max-w-6xl p-6 md:p-10">{children}</div>
      </section>
    </main>
  );
};

export default AdminLayout;
