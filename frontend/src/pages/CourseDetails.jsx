import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { API_ORIGIN } from "../services/api";

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchCourse();
    fetchLessons();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await API.get(`/courses/${id}/lessons`);
      setLessons(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!course) {
    return (
      <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen flex items-center justify-center transition-colors duration-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen p-10 transition-colors duration-300">

      {/* Course Image */}
      <img
        src={`${API_ORIGIN}${course.image}`}
        alt={course.title}
        className="w-full max-w-4xl h-[400px] object-cover rounded-2xl mb-8"
      />

      {/* Course Title */}
      <h1 className="text-5xl font-bold mb-6">
        {course.title}
      </h1>

      {/* Course Description */}
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-10">
        {course.description}
      </p>

      {/* Course Lessons */}
      <h2 className="text-3xl font-bold mt-10 mb-6">
        Lessons 📚
      </h2>

      <div className="space-y-6">

        {course.lessons?.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-gray-100 dark:bg-gray-900 p-5 rounded-2xl transition-colors duration-300"
          >

            <h3 className="text-2xl font-semibold mb-3">
              {lesson.title}
            </h3>

            <video
              controls
              className="w-full rounded-xl"
              src={`${API_ORIGIN}${lesson.video}`}
            />

          </div>
        ))}

      </div>

      {/* Lessons */}
      <div className="space-y-8 mt-10">

        <h2 className="text-3xl font-bold mb-4">
          Lessons
        </h2>

        {lessons.length === 0 ? (

          <p className="text-gray-600 dark:text-gray-400">
            No lessons yet
          </p>

        ) : (

          lessons.map((lesson) => (

            <div
              key={lesson.id}
              className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl transition-colors duration-300"
            >

              <h3 className="text-2xl font-semibold mb-4">
                {lesson.title}
              </h3>

              <video
                controls
                className="w-full rounded-xl"
              >

                <source
                  src={`${API_ORIGIN}${lesson.video}`}
                  type="video/mp4"
                />

              </video>

            </div>

          ))

        )}

      </div>

    </div>
  );
}
