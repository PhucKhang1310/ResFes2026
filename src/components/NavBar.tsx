import { useEffect, useState } from "react";

const NavBar = () => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`absolute inset-x-0 top-0 z-30 transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 pt-4 lg:px-10">
        <div className="navbar bg-transparent p-0">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">ResFes</a>
            <ul className="menu menu-horizontal px-1">
              <li>
                <a>About</a>
              </li>
              <li>
                <a>Research Fields</a>
              </li>
              <li>
                <a>Regulations</a>
              </li>
              <li>
                <a>Milestones</a>
              </li>
            </ul>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a>News</a>
              </li>
              <li>
                <a>History</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="divider" />
    </header>
  );
};
export default NavBar;
