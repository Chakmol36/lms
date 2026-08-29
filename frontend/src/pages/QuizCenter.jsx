import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function QuizCenter() {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // GET ENROLLED COURSES
  // ========================================

  useEffect(() => {
    fetchQuizCenter();
  }, []);

  const fetchQuizCenter = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to access the Quiz Center.");
        return;
      }

      const response = await API.get(
        "/enrollment/my-courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const enrolledCourses = response.data || [];

      setCourses(enrolledCourses);

      // ========================================
      // GET QUIZZES FOR EACH COURSE
      // ========================================

      const quizData = {};

      await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const quizResponse = await API.get(
              `/quizzes/course/${course.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            quizData[course.id] =
              quizResponse.data || [];
          } catch (quizError) {
            console.error(
              `Failed to fetch quizzes for course ${course.id}:`,
              quizError
            );

            quizData[course.id] = [];
          }
        })
      );

      setQuizzes(quizData);

    } catch (error) {
      console.error("Quiz Center Error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load the Quiz Center."
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
          transition-colors duration-300
        "
      >
        <div className="text-center">
          <div className="text-5xl mb-4">
            📝
          </div>

          <p className="text-xl font-semibold">
            Loading Quiz Center...
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
            Quiz Center Unavailable
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-7">
            {error}
          </p>

          <button
            onClick={fetchQuizCenter}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              px-6 py-3
              rounded-xl
              transition
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  // ========================================
  // NO COURSES
  // ========================================

  if (courses.length === 0) {
    return (
      <div
        className="
          min-h-screen
          bg-gray-50 dark:bg-black
          text-gray-900 dark:text-white
          px-6 py-12
          transition-colors duration-300
        "
      >
        <div className="max-w-6xl mx-auto text-center">

          <div className="text-7xl mb-6">
            📝
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Quiz Center
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            You don't have any enrolled courses yet.
          </p>

          <Link
            to="/courses"
            className="
              inline-block
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              px-7 py-3
              rounded-xl
              transition
            "
          >
            Browse Courses →
          </Link>

        </div>
      </div>
    );
  }


  // ========================================
  // MAIN QUIZ CENTER
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

          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
            Assessment Center
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold">
            Quiz Center 📝
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg mt-3">
            Test your knowledge and complete the assessments for your courses.
          </p>

        </div>


        {/* COURSE QUIZZES */}

        <div className="space-y-8">

          {courses.map((course) => {

            const courseQuizzes =
              quizzes[course.id] || [];

            return (
              <div
                key={course.id}
                className="
                  bg-white dark:bg-gray-900
                  border border-gray-200 dark:border-gray-800
                  rounded-3xl
                  p-6 md:p-8
                  shadow-sm
                "
              >

                {/* COURSE HEADER */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

                  <div>

                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">
                      Course
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold mt-1">
                      {course.title}
                    </h2>

                  </div>

                  <Link
                    to={`/courses/${course.id}/learn`}
                    className="
                      text-sm
                      text-blue-600 dark:text-blue-400
                      font-semibold
                      hover:underline
                    "
                  >
                    Continue Course →
                  </Link>

                </div>


                {/* NO QUIZ */}

                {courseQuizzes.length === 0 ? (

                  <div
                    className="
                      bg-gray-100 dark:bg-gray-800
                      rounded-2xl
                      p-6
                      text-center
                    "
                  >
                    <div className="text-3xl mb-2">
                      📚
                    </div>

                    <p className="font-semibold">
                      No quiz available yet
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Your instructor hasn't added a quiz for this course.
                    </p>
                  </div>

                ) : (

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {courseQuizzes.map((quiz) => (

                      <div
                        key={quiz.id}
                        className="
                          border
                          border-gray-200 dark:border-gray-700
                          rounded-2xl
                          p-6
                          hover:border-blue-500
                          hover:shadow-lg
                          transition
                        "
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <div
                              className="
                                w-12 h-12
                                rounded-xl
                                bg-blue-100 dark:bg-blue-900/30
                                flex items-center justify-center
                                text-2xl
                                mb-4
                              "
                            >
                              📝
                            </div>

                            <h3 className="text-xl font-bold">
                              {quiz.title}
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                              Test your knowledge of this course.
                            </p>

                          </div>

                        </div>

                        <Link
                          to={`/quiz/${quiz.id}`}
                          className="
                            block
                            text-center
                            mt-6
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-semibold
                            py-3
                            rounded-xl
                            transition
                          "
                        >
                          Take Quiz →
                        </Link>

                      </div>

                    ))}

                  </div>

                )}

              </div>
            );

          })}

        </div>

      </div>
    </div>
  );
}