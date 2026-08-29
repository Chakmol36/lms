import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Achievements() {

  const [courses, setCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ========================================
  // LOAD ACHIEVEMENTS
  // ========================================

  useEffect(() => {
    fetchAchievements();
  }, []);


  const fetchAchievements = async () => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");


      if (!token) {

        setError(
          "You must be logged in to view your achievements."
        );

        return;

      }


      // ========================================
      // GET ENROLLED COURSES
      // ========================================

      const courseResponse =
        await API.get(
          "/enrollment/my-courses",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const enrolledCourses =
        courseResponse.data || [];


      setCourses(enrolledCourses);


      // ========================================
      // CHECK COMPLETION FOR EACH COURSE
      // ========================================

      const completedCourses = [];


      await Promise.all(

        enrolledCourses.map(
          async (course) => {

            try {

              const response =
                await API.get(
                  `/progress/${course.id}/completion`,
                  {
                    headers: {
                      Authorization:
                        `Bearer ${token}`,
                    },
                  }
                );


              const data =
                response.data;


              if (data.eligible) {

                completedCourses.push({

                  ...course,

                  quizResult:
                    data.quizResult,

                });

              }

            } catch (completionError) {

              console.error(
                `Achievement check failed for course ${course.id}:`,
                completionError
              );

            }

          }
        )

      );


      setAchievements(
        completedCourses
      );


    } catch (error) {

      console.error(
        "Achievements Error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Unable to load your achievements."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-gray-50 dark:bg-black
          text-gray-900 dark:text-white
          flex items-center justify-center
        "
      >

        <div className="text-center">

          <div className="text-6xl mb-5">
            🏆
          </div>

          <p className="text-xl font-semibold">
            Loading achievements...
          </p>

        </div>

      </div>

    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (

      <div
        className="
          min-h-screen
          bg-gray-50 dark:bg-black
          text-gray-900 dark:text-white
          flex items-center justify-center
          px-6
        "
      >

        <div
          className="
            max-w-lg
            w-full
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-800
            rounded-3xl
            p-10
            text-center
            shadow-xl
          "
        >

          <div className="text-6xl mb-5">
            ⚠️
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Achievements Unavailable
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-7">
            {error}
          </p>

          <button
            onClick={fetchAchievements}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              px-6 py-3
              rounded-xl
            "
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  // ========================================
  // MAIN PAGE
  // ========================================

  return (

    <div
      className="
        min-h-screen
        bg-gray-50 dark:bg-black
        text-gray-900 dark:text-white
        px-6 md:px-10
        py-10
        transition-colors duration-300
      "
    >

      <div className="max-w-7xl mx-auto">


        {/* HEADER */}

        <div className="mb-10">

          <p className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2">
            Your accomplishments
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold">
            My Achievements 🏆
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg mt-3">
            View the certificates you've earned by completing your courses.
          </p>

        </div>


        {/* STAT CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

          <div
            className="
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              rounded-2xl
              p-6
            "
          >

            <div className="text-3xl mb-3">
              🎓
            </div>

            <p className="text-gray-500 dark:text-gray-400">
              Enrolled Courses
            </p>

            <p className="text-3xl font-bold mt-1">
              {courses.length}
            </p>

          </div>


          <div
            className="
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              rounded-2xl
              p-6
            "
          >

            <div className="text-3xl mb-3">
              🏆
            </div>

            <p className="text-gray-500 dark:text-gray-400">
              Certificates Earned
            </p>

            <p className="text-3xl font-bold mt-1">
              {achievements.length}
            </p>

          </div>


          <div
            className="
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              rounded-2xl
              p-6
            "
          >

            <div className="text-3xl mb-3">
              🚀
            </div>

            <p className="text-gray-500 dark:text-gray-400">
              Keep Learning
            </p>

            <p className="text-lg font-bold mt-1">
              {achievements.length > 0
                ? "Great work!"
                : "Your first certificate awaits!"}
            </p>

          </div>

        </div>


        {/* ========================================
            CERTIFICATES
        ======================================== */}

        {achievements.length === 0 ? (

          <div
            className="
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              rounded-3xl
              p-10 md:p-14
              text-center
            "
          >

            <div className="text-7xl mb-6">
              🏆
            </div>

            <h2 className="text-3xl font-bold mb-4">
              No Certificates Yet
            </h2>

            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
              Complete all the lessons in one of your courses and pass its quiz
              with at least 70% to earn your certificate.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link
                to="/my-courses"
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  px-6 py-3
                  rounded-xl
                "
              >
                My Courses
              </Link>

              <Link
                to="/quiz-center"
                className="
                  bg-gray-200 dark:bg-gray-800
                  hover:bg-gray-300 dark:hover:bg-gray-700
                  font-semibold
                  px-6 py-3
                  rounded-xl
                "
              >
                Quiz Center
              </Link>

            </div>

          </div>

        ) : (

          <div>

            <h2 className="text-2xl font-bold mb-5">
              Your Certificates
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {achievements.map((course) => (

                <div
                  key={course.id}
                  className="
                    bg-white dark:bg-gray-900
                    border border-gray-200 dark:border-gray-800
                    rounded-3xl
                    p-7
                    shadow-sm
                    hover:shadow-xl
                    transition
                  "
                >

                  <div
                    className="
                      w-16 h-16
                      rounded-2xl
                      bg-yellow-100 dark:bg-yellow-900/30
                      flex items-center justify-center
                      text-4xl
                      mb-5
                    "
                  >
                    🏆
                  </div>

                  <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold uppercase tracking-wide">
                    Certificate Earned
                  </p>

                  <h3 className="text-2xl font-bold mt-2 mb-3">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Congratulations! You successfully completed this course.
                  </p>

                  {course.quizResult && (

                    <div
                      className="
                        bg-gray-100 dark:bg-gray-800
                        rounded-xl
                        p-4
                        mb-6
                      "
                    >

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Final Quiz Score
                      </p>

                      <p className="text-2xl font-bold mt-1">
                        {Math.round(
                          Number(
                            course.quizResult.percentage
                          )
                        )}%
                      </p>

                    </div>

                  )}

                  <Link
                    to={`/certificate/${course.id}`}
                    className="
                      block
                      text-center
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      font-semibold
                      py-3
                      rounded-xl
                      transition
                    "
                  >
                    View Certificate →
                  </Link>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>

  );
}