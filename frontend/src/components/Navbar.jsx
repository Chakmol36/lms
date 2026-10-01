import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") return false;
    if (savedTheme === "dark") return true;

    return true;
  });

  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (error) {
      console.error("Error reading token:", error);
    }
  }

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav
      className="
        w-full
        max-w-full
        overflow-x-hidden
        bg-white
        px-6
        py-5
        text-gray-900
        transition-colors
        duration-300
        dark:bg-gray-950
        dark:text-white
        md:px-10
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-wrap
          items-center
          justify-between
          gap-4
          md:flex-nowrap
        "
      >
        <Link
          to="/"
          className="
            text-2xl
            font-bold
            text-gray-900
            transition-colors
            hover:text-blue-600
            dark:text-white
            dark:hover:text-blue-400
            md:text-3xl
          "
        >
          LMS 🚀
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            text-2xl
            hover:bg-gray-100
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            dark:hover:bg-gray-800
            md:hidden
          "
        >
          <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
        </button>

        {menuOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />
        )}

        <div
          id="primary-navigation"
          onClick={() => setMenuOpen(false)}
          className={`
            fixed
            inset-y-0
            right-0
            z-50
            flex
            h-dvh
            w-4/5
            max-w-sm
            flex-col
            items-stretch
            gap-5
            overflow-y-auto
            bg-white
            p-6
            shadow-2xl
            transition-transform
            duration-300
            ease-in-out
            dark:bg-gray-950
            ${
              menuOpen
                ? "visible translate-x-0"
                : "invisible translate-x-full"
            }

            md:!static
            md:!visible
            md:!z-auto
            md:!h-auto
            md:!w-auto
            md:!max-w-none
            md:!translate-x-0
            md:flex-row
            md:flex-nowrap
            md:items-center
            md:gap-6
            md:overflow-visible
            md:bg-transparent
            md:p-0
            md:shadow-none
            md:transition-none
            md:dark:bg-transparent
          `}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
            className="
              mb-2
              self-end
              rounded-lg
              px-3
              py-2
              text-2xl
              hover:bg-gray-100
              dark:hover:bg-gray-800
              md:hidden
            "
          >
            <span aria-hidden="true">×</span>
          </button>

          <Link
            to="/"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            to="/courses"
            className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
          >
            Courses
          </Link>

          {token && (
            <Link
              to="/my-courses"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              My Courses
            </Link>
          )}

          {(role === "instructor" || role === "admin") && (
            <>
              <Link
                to="/create-course"
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                Create Course
              </Link>

              <Link
                to="/instructor"
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                Instructor Dashboard
              </Link>
            </>
          )}

          {role === "admin" && (
            <Link
              to="/admin"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              Admin
            </Link>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-gray-200
              text-lg
              transition-all
              duration-300
              hover:scale-105
              hover:bg-gray-300
              active:scale-95
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              dark:bg-gray-800
              dark:hover:bg-gray-700
            "
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {!token ? (
            <>
              <Link
                to="/login"
                className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2
                  text-white
                  transition-colors
                  hover:bg-blue-700
                "
              >
                Register
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="
                rounded-lg
                bg-red-600
                px-4
                py-2
                text-white
                transition-colors
                hover:bg-red-700
              "
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}