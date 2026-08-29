import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {

  // =========================================
  // CENTRAL THEME CONTROLLER
  // =========================================

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    // If the user has already chosen a theme,
    // use that choice.
    if (savedTheme === "light") {
      return false;
    }

    if (savedTheme === "dark") {
      return true;
    }

    // Default theme
    return true;
  });


  // =========================================
  // APPLY THEME TO ENTIRE APPLICATION
  // =========================================

  useEffect(() => {

    const html = document.documentElement;

    if (darkMode) {

      html.classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      html.classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );

    }

  }, [darkMode]);


  // =========================================
  // AUTHENTICATION
  // =========================================

  const token =
    localStorage.getItem("token");


  // =========================================
  // GET USER ROLE
  // =========================================

  let role = null;

  if (token) {

    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      role = payload.role;

    } catch (error) {

      console.error(
        "Error reading token:",
        error
      );

    }

  }


  // =========================================
  // TOGGLE THEME
  // =========================================

  const toggleTheme = () => {

    setDarkMode(
      (current) => !current
    );

  };


  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/login";

  };


  // =========================================
  // NAVBAR
  // =========================================

  return (

    <nav
      className="
        w-full
        bg-white
        dark:bg-gray-950
        text-gray-900
        dark:text-white

        px-6
        md:px-10
        py-5

        flex
        flex-wrap
        justify-between
        items-center

        gap-4

        border-b
        border-gray-200
        dark:border-gray-800

        transition-colors
        duration-300
      "
    >

      {/* ===================================== */}
      {/* LOGO */}
      {/* ===================================== */}

      <Link
        to="/"
        className="
          text-2xl
          md:text-3xl
          font-bold

          text-gray-900
          dark:text-white

          hover:text-blue-600
          dark:hover:text-blue-400

          transition-colors
        "
      >
        LMS 🚀
      </Link>


      {/* ===================================== */}
      {/* NAVIGATION */}
      {/* ===================================== */}

      <div
        className="
          flex
          flex-wrap
          gap-3
          md:gap-6
          items-center
        "
      >

        {/* ================================= */}
        {/* HOME */}
        {/* ================================= */}

        <Link
          to="/"
          className="
            hover:text-blue-600
            dark:hover:text-blue-400
            transition-colors
          "
        >
          Home
        </Link>


        {/* ================================= */}
        {/* COURSES */}
        {/* ================================= */}

        <Link
          to="/courses"
          className="
            hover:text-blue-600
            dark:hover:text-blue-400
            transition-colors
          "
        >
          Courses
        </Link>


        {/* ================================= */}
        {/* MY COURSES */}
        {/* ================================= */}

        {token && (

          <Link
            to="/my-courses"
            className="
              hover:text-blue-600
              dark:hover:text-blue-400
              transition-colors
            "
          >
            My Courses
          </Link>

        )}


        {/* ================================= */}
        {/* INSTRUCTOR LINKS */}
        {/* ================================= */}

        {(role === "instructor" ||
          role === "admin") && (

          <>

            <Link
              to="/create-course"
              className="
                hover:text-blue-600
                dark:hover:text-blue-400
                transition-colors
              "
            >
              Create Course
            </Link>


            <Link
              to="/instructor"
              className="
                hover:text-blue-600
                dark:hover:text-blue-400
                transition-colors
              "
            >
              Instructor Dashboard
            </Link>

          </>

        )}


        {/* ================================= */}
        {/* ADMIN */}
        {/* ================================= */}

        {role === "admin" && (

          <Link
            to="/admin"
            className="
              hover:text-blue-600
              dark:hover:text-blue-400
              transition-colors
            "
          >
            Admin
          </Link>

        )}


        {/* ================================= */}
        {/* CENTRAL THEME TOGGLE */}
        {/* ================================= */}

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="
            w-10
            h-10

            rounded-full

            flex
            items-center
            justify-center

            bg-gray-200
            hover:bg-gray-300

            dark:bg-gray-800
            dark:hover:bg-gray-700

            text-lg

            transition-all
            duration-300

            hover:scale-105
            active:scale-95

            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >

          {darkMode
            ? "☀️"
            : "🌙"}

        </button>


        {/* ================================= */}
        {/* AUTHENTICATION */}
        {/* ================================= */}

        {!token ? (

          <>

            {/* LOGIN */}

            <Link
              to="/login"
              className="
                hover:text-blue-600
                dark:hover:text-blue-400
                transition-colors
              "
            >
              Login
            </Link>


            {/* REGISTER */}

            <Link
              to="/register"
              className="
                bg-blue-600
                hover:bg-blue-700

                text-white

                px-4
                py-2

                rounded-lg

                transition-colors
              "
            >
              Register
            </Link>

          </>

        ) : (

          /* LOGOUT */

          <button
            type="button"
            onClick={logout}
            className="
              bg-red-600
              hover:bg-red-700

              text-white

              px-4
              py-2

              rounded-lg

              transition-colors
            "
          >
            Logout
          </button>

        )}

      </div>

    </nav>

  );

}