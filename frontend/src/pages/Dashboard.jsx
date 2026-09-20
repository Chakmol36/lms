import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {

  const [userName, setUserName] =
    useState("Student");

  const [stats, setStats] = useState({
    courses: 0,
    completed: 0,
    certificates: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);


  const getUserName = () => {

    // ========================================
    // TRY JWT
    // ========================================

    const token =
      localStorage.getItem("token");

    if (token) {

      try {

        const payload =
          JSON.parse(
            atob(token.split(".")[1])
          );

        if (payload.name) {
          return payload.name;
        }

        if (payload.fullName) {
          return payload.fullName;
        }

        if (payload.username) {
          return payload.username;
        }

      } catch (error) {

        console.error(
          "Could not read JWT:",
          error
        );

      }
    }


    // ========================================
    // TRY LOCAL STORAGE USER
    // ========================================

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      try {

        const user =
          JSON.parse(storedUser);

        if (user.name) {
          return user.name;
        }

        if (user.fullName) {
          return user.fullName;
        }

        if (user.username) {
          return user.username;
        }

      } catch (error) {

        console.error(
          "Could not read stored user:",
          error
        );

      }

    }


    return "Student";
  };


  const loadDashboard = async () => {

    setUserName(getUserName());

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await API.get(
          "/enrollment/my-courses",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const courses =
        response.data || [];


      let completedCount = 0;
      let certificateCount = 0;


      for (const course of courses) {

        try {

          const completion =
            await API.get(
              `/progress/${course.id}/completion`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          if (
            completion.data?.eligible
          ) {

            completedCount++;
            certificateCount++;

          }

        } catch (error) {

          console.error(
            `Dashboard progress error for course ${course.id}:`,
            error
          );

        }

      }


      setStats({

        courses:
          courses.length,

        completed:
          completedCount,

        certificates:
          certificateCount,

      });

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );

    }

  };


  return (

    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white transition-colors duration-300">


      {/* ======================================== */}
      {/* WELCOME */}
      {/* ======================================== */}

      <section className="px-6 md:px-10 lg:px-16 pt-10 pb-8">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <div>

              <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                Learning Management System
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Welcome back, {userName}! 👋
              </h1>

              <p className="text-gray-600 dark:text-gray-400 text-lg mt-3">
                Continue your learning journey and keep making progress.
              </p>

            </div>


            <Link
              to="/courses"
              className="
                inline-flex
                items-center
                justify-center
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-semibold
                px-6
                py-3
                rounded-xl
                shadow-lg
                shadow-blue-600/20
                transition
              "
            >
              Browse Courses →
            </Link>

          </div>

        </div>

      </section>


      {/* ======================================== */}
      {/* MAIN CARDS */}
      {/* ======================================== */}

      <section className="px-6 md:px-10 lg:px-16 pb-10">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


            {/* COURSES */}

            <Link
              to="/courses"
              className="
                group
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                rounded-2xl
                p-7
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
              "
            >

              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl mb-5">
                📚
              </div>

              <h2 className="text-2xl font-bold mb-2">
                Courses
              </h2>

              <p className="text-gray-600 dark:text-gray-400">
                Browse available courses and discover something new to learn.
              </p>

              <div className="mt-5 text-blue-600 dark:text-blue-400 font-semibold">
                Explore courses →
              </div>

            </Link>


            {/* MY PROGRESS */}

            <Link
              to="/my-progress"
              className="
                group
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                rounded-2xl
                p-7
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
              "
            >

              <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-3xl mb-5">
                📈
              </div>

              <h2 className="text-2xl font-bold mb-2">
                My Progress
              </h2>

              <p className="text-gray-600 dark:text-gray-400">
                See how many lessons you've completed and how close you are to finishing.
              </p>

              <div className="mt-5 text-green-600 dark:text-green-400 font-semibold">
                View progress →
              </div>

            </Link>


            {/* ACHIEVEMENTS */}

            <Link
              to="/achievements"
              className="
                group
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                rounded-2xl
                p-7
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
              "
            >

              <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-3xl mb-5">
                🏆
              </div>

              <h2 className="text-2xl font-bold mb-2">
                My Achievements
              </h2>

              <p className="text-gray-600 dark:text-gray-400">
                View certificates you've earned from successfully completing courses.
              </p>

              <div className="mt-5 text-yellow-600 dark:text-yellow-400 font-semibold">
                View achievements →
              </div>

            </Link>

          </div>

        </div>

      </section>


      {/* ======================================== */}
      {/* LEARNING OVERVIEW */}
      {/* ======================================== */}

      <section className="px-6 md:px-10 lg:px-16 pb-10">

        <div className="max-w-7xl mx-auto">

          <div className="mb-6">

            <h2 className="text-2xl md:text-3xl font-bold">
              Your Learning Overview
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-1">
              A quick look at your learning journey.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">


            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">

              <div className="text-3xl mb-3">
                📚
              </div>

              <p className="text-gray-500 dark:text-gray-400">
                Enrolled Courses
              </p>

              <p className="text-3xl font-extrabold mt-1">
                {stats.courses}
              </p>

            </div>


            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">

              <div className="text-3xl mb-3">
                🎓
              </div>

              <p className="text-gray-500 dark:text-gray-400">
                Courses Completed
              </p>

              <p className="text-3xl font-extrabold mt-1">
                {stats.completed}
              </p>

            </div>


            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">

              <div className="text-3xl mb-3">
                🏆
              </div>

              <p className="text-gray-500 dark:text-gray-400">
                Certificates
              </p>

              <p className="text-3xl font-extrabold mt-1">
                {stats.certificates}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================== */}
      {/* QUIZ CENTER */}
      {/* ======================================== */}

      <section className="px-6 md:px-10 lg:px-16 pb-12">

        <div className="max-w-7xl mx-auto">

          <div
            className="
              rounded-3xl
              bg-gradient-to-r
              from-purple-600
              to-blue-600
              p-8
              md:p-10
              text-white
              shadow-xl
            "
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <div className="text-4xl mb-4">
                  📝
                </div>

                <h2 className="text-2xl md:text-3xl font-bold">
                  Ready for your next quiz?
                </h2>

                <p className="text-purple-100 mt-3 text-lg">
                  Test your knowledge after completing your course lessons.
                </p>

              </div>


              <Link
                to="/quiz-center"
                className="
                  inline-flex
                  items-center
                  justify-center
                  bg-white
                  text-purple-700
                  font-bold
                  px-6
                  py-3
                  rounded-xl
                  hover:bg-purple-50
                  transition
                  whitespace-nowrap
                "
              >
                Open Quiz Center →
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-gray-200 dark:border-gray-800">

        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-6">

          <p className="text-center text-sm text-gray-500">
            LMS • Learn. Grow. Succeed. 🚀
          </p>

        </div>

      </footer>

    </div>
  );
}