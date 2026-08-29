import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyProgress() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get("/enrollment/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const enrolledCourses = response.data || [];

      setCourses(enrolledCourses);

      const progressData = await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const result = await API.get(
              `/progress/${course.id}/completion`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            return {
              ...course,
              ...result.data,
            };
          } catch (err) {
            console.error(
              `Progress error for course ${course.id}:`,
              err
            );

            return {
              ...course,
              totalLessons: 0,
              completedLessons: 0,
              lessonsCompleted: false,
              quizPassed: false,
              eligible: false,
            };
          }
        })
      );

      setProgress(progressData);
    } catch (err) {
      console.error("Failed to load progress:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your learning progress."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (course) => {
    const total = Number(course.totalLessons || 0);
    const completed = Number(course.completedLessons || 0);

    if (total === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round((completed / total) * 100)
    );
  };

  const getStatus = (course) => {
    const percentage = getPercentage(course);

    if (course.eligible) {
      return {
        text: "Completed",
        className:
          "text-green-600 dark:text-green-400",
      };
    }

    if (percentage === 100 && !course.quizPassed) {
      return {
        text: "Take Quiz",
        className:
          "text-purple-600 dark:text-purple-400",
      };
    }

    if (percentage > 0) {
      return {
        text: "In Progress",
        className:
          "text-blue-600 dark:text-blue-400",
      };
    }

    return {
      text: "Not Started",
      className:
        "text-gray-500 dark:text-gray-400",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white px-6 md:px-10 lg:px-16 py-10 transition-colors duration-300">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
            Learning Dashboard
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold">
            My Progress 📈
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg mt-3">
            Track your lessons, quizzes, and overall learning progress.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-8 rounded-2xl bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-5 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!loading && courses.length === 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              📚
            </div>

            <h2 className="text-2xl font-bold mb-2">
              No courses yet
            </h2>

            <p className="text-gray-600 dark:text-gray-400">
              Enroll in a course to start tracking your progress.
            </p>

          </div>
        )}


        {/* COURSE PROGRESS */}

        <div className="space-y-6">

          {progress.map((course) => {

            const percentage =
              getPercentage(course);

            const status =
              getStatus(course);

            return (
              <div
                key={course.id}
                className="
                  bg-white dark:bg-gray-900
                  border border-gray-200 dark:border-gray-800
                  rounded-2xl
                  p-6
                  shadow-sm
                "
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                  <div className="flex-1">

                    <h2 className="text-2xl font-bold">
                      {course.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {course.completedLessons || 0} of{" "}
                      {course.totalLessons || 0} lessons completed
                    </p>

                  </div>


                  <div className="text-left md:text-right">

                    <div className="text-3xl font-extrabold">
                      {percentage}%
                    </div>

                    <div
                      className={`font-semibold ${status.className}`}
                    >
                      {status.text}
                    </div>

                  </div>

                </div>


                {/* PROGRESS BAR */}

                <div className="mt-6">

                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">

                    <div
                      className={`h-full transition-all duration-500 ${
                        course.eligible
                          ? "bg-green-500"
                          : percentage === 100
                          ? "bg-purple-500"
                          : "bg-blue-600"
                      }`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>


                {/* DETAILS */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Lessons
                    </p>

                    <p className="text-xl font-bold mt-1">
                      {course.completedLessons || 0}/
                      {course.totalLessons || 0}
                    </p>

                  </div>


                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quiz
                    </p>

                    <p className="text-xl font-bold mt-1">

                      {course.quizPassed
                        ? "Passed ✓"
                        : percentage === 100
                        ? "Ready"
                        : "Locked"}

                    </p>

                  </div>


                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Certificate
                    </p>

                    <p className="text-xl font-bold mt-1">

                      {course.eligible
                        ? "Earned 🏆"
                        : "Not yet"}

                    </p>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}