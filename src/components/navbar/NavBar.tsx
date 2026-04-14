import { useEffect, useRef, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import MobileMenu from "./MobileMenu";
import { useCheckMobile } from "../../hook/useCheckMobile";
import logo from "../../assets/logo.png";

const NavBar = () => {
  const { isMobile } = useCheckMobile();
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const previousScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY <= 0);

      if (currentScrollY <= 0) {
        setIsHidden(false);
      } else if (currentScrollY > previousScrollY.current) {
        setIsHidden(true);
      } else if (currentScrollY < previousScrollY.current) {
        setIsHidden(false);
      }

      previousScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      queueMicrotask(() => setIsMenuOpen(false));
    }
  }, [isMobile]);

  if (!isMobile) {
    return (
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-transform duration-300 ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`${
            isAtTop ? "bg-transparent" : "bg-black"
          } border-b border-white/20 transition-colors duration-500`}
        >
          <div className="mx-auto w-full max-w-7xl px-6 py-4 lg:px-10">
            <div className="navbar text-white">
              <div className="navbar-start flex items-center gap-6">
                <a
                  href="#home"
                  className="inline-flex items-center justify-center leading-none"
                >
                  <img
                    src={logo}
                    className="block h-10 w-auto object-contain"
                  />
                </a>
                <ul className="menu menu-horizontal px-1 [&>li>a]:text-white!">
                  <li>
                    <a href="#about">About</a>
                  </li>
                  <li>
                    <a href="#research-fields">Research Fields</a>
                  </li>
                  <li>
                    <a href="#regulations">Regulations</a>
                  </li>
                  <li>
                    <a href="#milestones">Milestones</a>
                  </li>
                </ul>
              </div>
              <div className="navbar-end">
                <ul className="menu menu-horizontal px-1 [&>li>a]:text-white!">
                  <li>
                    <a href="#workshops">News</a>
                  </li>
                  <li>
                    <a href="#awards">History</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`h-7 bg-linear-to-b from-black/75 to-transparent transition-opacity duration-500 ${
            isAtTop ? "opacity-0" : "opacity-100"
          }`}
        />
      </header>
    );
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 flex items-center gap-4 px-6 py-4 lg:px-10 transition-transform duration-200 ${
          isHidden ? "-translate-y-full" : "translate-y-0"
        } ${isAtTop ? "bg-transparent" : "bg-black/80 backdrop-blur"}`}
      >
        <button
          type="button"
          className="btn btn-ghost btn-sm text-white!"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
        >
          <RxHamburgerMenu size={20} />
        </button>

        <a href="#home" className="inline-flex items-center leading-none">
          <img src={logo} className="block h-10 w-auto object-contain" />
        </a>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default NavBar;
