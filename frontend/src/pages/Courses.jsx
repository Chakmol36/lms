import { useEffect, useState } from "react";
import API, { API_ORIGIN } from "../services/api";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  // ========================================
  // GET USER ROLE FROM JWT
  // ========================================

  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      role = payload.role;
    } catch (error) {
      console.log("Could not read user role:", error);
    }
  }

  // ========================================
  // FETCH COURSES
  // ========================================

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ========================================
  // ENROLL COURSE
  // ========================================

  const enrollCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login before enrolling in a course.");
        return;
      }

      const res = await API.post(
        `/enrollment/enroll/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Enrollment failed"
      );
    }
  };

  // ========================================
  // DELETE COURSE
  // ========================================

  const deleteCourse = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Course deleted");

      fetchCourses();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete course"
      );
    }
  };

  // ========================================
  // CONFIRM DELETE
  // ========================================

  const handleDelete = (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (confirmed) {
      deleteCourse(courseId);
    }
  };

  // ========================================
  // PAGE
  // ========================================

  return (
    <div
      className="
        min-h-screen
        p-10

        bg-gray-100
        text-gray-900

        dark:bg-black
        dark:text-white

        transition-colors
        duration-300
      "
    >

      {/* ========================================
          PAGE TITLE
      ======================================== */}

      <h1
        className="
          text-4xl
          font-bold
          mb-8

          text-gray-900
          dark:text-white
        "
      >
        Courses 📚
      </h1>


      {/* ========================================
          SEARCH
      ======================================== */}

      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          p-4
          mb-8
          rounded-xl

          bg-white
          text-gray-900

          border
          border-gray-300

          placeholder-gray-500

          focus:outline-none
          focus:ring-2
          focus:ring-blue-500

          dark:bg-gray-900
          dark:text-white
          dark:border-gray-700
          dark:placeholder-gray-400

          transition-colors
          duration-300
        "
      />


      {/* ========================================
          COURSE GRID
      ======================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
      >

        {courses
          .filter((course) =>
            course.title
              .toLowerCase()
              .includes(search.toLowerCase())
          )
          .map((course) => (

            <div
              key={course.id}
              className="
                p-6
                rounded-2xl
                shadow-lg

                bg-white
                text-gray-900

                border
                border-gray-200

                dark:bg-gray-900
                dark:text-white
                dark:border-gray-800

                transition-colors
                duration-300
              "
            >

              {/* ========================================
                  COURSE IMAGE
              ======================================== */}

              {course.image && (
                <img
                  src={`${API_ORIGIN}${course.image}`}
                  alt={course.title}
                  className="
                    w-full
                    h-48
                    object-cover
                    rounded-xl
                    mb-4
                  "
                />
              )}


              {/* ========================================
                  COURSE TITLE
              ======================================== */}

              <h2
                className="
                  text-2xl
                  font-bold
                  mb-2

                  text-gray-900
                  dark:text-white
                "
              >
                {course.title}
              </h2>


              {/* ========================================
                  COURSE DESCRIPTION
              ======================================== */}

              <p
                className="
                  text-gray-600
                  dark:text-gray-300

                  mb-5
                "
              >
                {course.description}
              </p>


              {/* ========================================
                  ENROLL
              ======================================== */}

              <button
                onClick={() =>
                  enrollCourse(course.id)
                }
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white

                  px-4
                  py-2
                  rounded-lg

                  transition
                "
              >
                Enroll
              </button>


              {/* ========================================
                  VIEW COURSE
              ======================================== */}

              <Link
                to={`/courses/${course.id}`}
                className="
                  block
                  mt-3

                  bg-gray-200
                  hover:bg-gray-300
                  text-gray-900

                  dark:bg-gray-700
                  dark:hover:bg-gray-600
                  dark:text-white

                  px-4
                  py-2

                  rounded-lg
                  text-center

                  transition
                "
              >
                View Course
              </Link>


              {/* ========================================
                  DELETE COURSE
                  ONLY INSTRUCTOR OR ADMIN
              ======================================== */}

              {(role === "instructor" ||
                role === "admin") && (

                <button
                  onClick={() =>
                    handleDelete(course.id)
                  }
                  className="
                    bg-red-600
                    hover:bg-red-700
                    text-white

                    px-4
                    py-2

                    rounded-lg
                    mt-3
                    w-full

                    transition
                  "
                >
                  Delete Course
                </button>

              )}

            </div>

          ))}

      </div>


      {/* ========================================
          NO RESULTS
      ======================================== */}

      {courses.filter((course) =>
        course.title
          .toLowerCase()
          .includes(search.toLowerCase())
      ).length === 0 && (

        <div
          className="
            text-center
            py-20

            text-gray-500
            dark:text-gray-400
          "
        >
          <p className="text-xl">
            No courses found.
          </p>
        </div>

      )}

    </div>
  );
}
