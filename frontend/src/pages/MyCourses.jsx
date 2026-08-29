import { useEffect, useState } from "react";
import API, { API_ORIGIN } from "../services/api";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/enrollment/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen p-6 md:p-10 transition-colors duration-300">

      <div className="max-w-7xl mx-auto">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-bold mb-8">
          My Courses 🎓
        </h1>

        {/* EMPTY STATE */}
        {courses.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 text-center">

            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No enrolled courses yet.
            </p>

          </div>
        ) : (

          /* COURSE GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {courses.map((course) => (

              <div
                key={course.id}
                className="bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg transition-colors duration-300"
              >

                {/* COURSE IMAGE */}
                {course.image ? (
                  <img
                    src={`${API_ORIGIN}${course.image}`}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      No image
                    </span>
                  </div>
                )}

                {/* COURSE CONTENT */}
                <div className="p-5">

                  <h2 className="text-2xl font-bold mb-2">
                    {course.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                    {course.description}
                  </p>

                  {/* START LEARNING */}
                  <a
                    href={`/courses/${course.id}/learn`}
                    className="block mt-5 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold transition"
                  >
                    Start Learning
                  </a>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}
