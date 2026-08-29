import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

import API from "../services/api";


export default function InstructorDashboard() {

  const [
    courses,
    setCourses
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");


  // ========================================
  // FETCH COURSES
  // ========================================

  useEffect(() => {

    fetchCourses();

  }, []);


  const fetchCourses = async () => {

    try {

      setLoading(true);

      setError("");

      const token =
        localStorage.getItem("token");


      const res =
        await API.get(
          "/courses",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      setCourses(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.log(
        "Error fetching courses:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Failed to load courses."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="
      bg-gray-100
      dark:bg-black
      text-gray-900
      dark:text-white
      min-h-screen
      px-6
      py-10
      transition-colors
      duration-300
    ">

      <div className="
        max-w-7xl
        mx-auto
      ">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-6
          mb-12
        ">

          <div>

            <h1 className="
              text-4xl
              md:text-5xl
              font-bold
            ">

              Instructor Dashboard 🎓

            </h1>


            <p className="
              text-gray-600
              dark:text-gray-400
              mt-3
              text-lg
            ">

              Manage your courses, lessons, quizzes,
              and student performance.

            </p>

          </div>


          <Link
            to="/create-course"
            className="
              inline-flex
              items-center
              justify-center
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-xl
              font-bold
              transition
            "
          >

            ➕ Create Course

          </Link>

        </div>


        {/* ================================= */}
        {/* QUICK STATS */}
        {/* ================================= */}

        {!loading && !error && (

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
            mb-12
          ">


            {/* TOTAL COURSES */}

            <div className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-2xl
              p-6
              shadow-sm
              dark:shadow-none
              transition-colors
            ">

              <p className="
                text-gray-500
                dark:text-gray-400
                mb-2
              ">

                Total Courses

              </p>


              <h2 className="
                text-4xl
                font-bold
              ">

                {courses.length}

              </h2>

            </div>


            {/* COURSE MANAGEMENT */}

            <div className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-2xl
              p-6
              shadow-sm
              dark:shadow-none
              transition-colors
            ">

              <p className="
                text-gray-500
                dark:text-gray-400
                mb-2
              ">

                Course Management

              </p>


              <h2 className="
                text-2xl
                font-bold
                text-green-600
                dark:text-green-400
              ">

                Active

              </h2>

            </div>


            {/* ANALYTICS */}

            <div className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-2xl
              p-6
              shadow-sm
              dark:shadow-none
              transition-colors
            ">

              <p className="
                text-gray-500
                dark:text-gray-400
                mb-2
              ">

                Analytics

              </p>


              <h2 className="
                text-2xl
                font-bold
                text-purple-600
                dark:text-purple-400
              ">

                Available 📊

              </h2>

            </div>

          </div>

        )}


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading && (

          <div className="
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            rounded-2xl
            p-10
            text-center
          ">

            <p className="
              text-gray-600
              dark:text-gray-400
              text-lg
            ">

              Loading your courses... ⏳

            </p>

          </div>

        )}


        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {!loading && error && (

          <div className="
            bg-red-50
            dark:bg-red-950
            border
            border-red-200
            dark:border-red-900
            rounded-2xl
            p-8
            mb-10
          ">

            <h2 className="
              text-red-600
              dark:text-red-400
              text-xl
              font-bold
              mb-2
            ">

              Unable to load courses

            </h2>


            <p className="
              text-gray-700
              dark:text-gray-300
              mb-5
            ">

              {error}

            </p>


            <button
              onClick={fetchCourses}
              className="
                bg-red-600
                hover:bg-red-700
                text-white
                px-5
                py-3
                rounded-xl
                font-bold
                transition
              "
            >

              Try Again

            </button>

          </div>

        )}


        {/* ================================= */}
        {/* NO COURSES */}
        {/* ================================= */}

        {!loading &&
          !error &&
          courses.length === 0 && (

          <div className="
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            p-10
            rounded-2xl
            text-center
          ">

            <div className="text-6xl mb-5">

              📚

            </div>


            <h2 className="
              text-2xl
              font-bold
              mb-3
            ">

              You haven't created any courses yet.

            </h2>


            <p className="
              text-gray-600
              dark:text-gray-400
              mb-7
            ">

              Start building your LMS by creating
              your first course.

            </p>


            <Link
              to="/create-course"
              className="
                inline-block
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-6
                py-3
                rounded-xl
                font-bold
                transition
              "
            >

              Create Your First Course 🚀

            </Link>

          </div>

        )}


        {/* ================================= */}
        {/* YOUR COURSES */}
        {/* ================================= */}

        {!loading &&
          !error &&
          courses.length > 0 && (

          <>

            <div className="
              flex
              items-center
              justify-between
              mb-6
            ">

              <h2 className="
                text-3xl
                font-bold
              ">

                Your Courses 📚

              </h2>


              <span className="
                text-gray-500
                dark:text-gray-400
              ">

                {courses.length}{" "}

                {courses.length === 1
                  ? "course"
                  : "courses"}

              </span>

            </div>


            {/* COURSE GRID */}

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            ">

              {courses.map((course) => (

                <div
                  key={course.id}
                  className="
                    bg-white
                    dark:bg-gray-900
                    border
                    border-gray-200
                    dark:border-gray-800
                    rounded-2xl
                    overflow-hidden
                    shadow-lg
                    hover:border-gray-300
                    dark:hover:border-gray-700
                    transition
                  "
                >


                  {/* COURSE IMAGE */}

                  <div className="
                    relative
                  ">

                    {course.image ? (

                      <img
                        src={`http://localhost:5000${course.image}`}
                        alt={course.title}
                        className="
                          w-full
                          h-52
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        w-full
                        h-52
                        bg-gray-200
                        dark:bg-gray-800
                        flex
                        items-center
                        justify-center
                      ">

                        <span className="
                          text-6xl
                        ">

                          📚

                        </span>

                      </div>

                    )}


                    <div className="
                      absolute
                      top-4
                      right-4
                      bg-black/80
                      text-white
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-semibold
                    ">

                      Course #{course.id}

                    </div>

                  </div>


                  {/* COURSE INFORMATION */}

                  <div className="p-6">

                    <h3 className="
                      text-2xl
                      font-bold
                      mb-3
                    ">

                      {course.title}

                    </h3>


                    <p className="
                      text-gray-600
                      dark:text-gray-400
                      mb-7
                      line-clamp-3
                    ">

                      {course.description ||
                        "No course description available."}

                    </p>


                    {/* ACTIONS */}

                    <div className="space-y-3">


                      {/* ADD LESSON */}

                      <Link
                        to={`/courses/${course.id}/add-lesson`}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          w-full
                          bg-blue-600
                          hover:bg-blue-700
                          text-white
                          px-4
                          py-3
                          rounded-xl
                          font-semibold
                          transition
                        "
                      >

                        <span>📚</span>

                        <span>Add Lesson</span>

                      </Link>


                      {/* CREATE QUIZ */}

                      <Link
                        to={`/courses/${course.id}/create-quiz`}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          w-full
                          bg-purple-600
                          hover:bg-purple-700
                          text-white
                          px-4
                          py-3
                          rounded-xl
                          font-semibold
                          transition
                        "
                      >

                        <span>📝</span>

                        <span>Create Quiz</span>

                      </Link>


                      {/* ANALYTICS */}

                      <Link
                        to={`/courses/${course.id}/analytics`}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          w-full
                          bg-orange-600
                          hover:bg-orange-700
                          text-white
                          px-4
                          py-3
                          rounded-xl
                          font-semibold
                          transition
                        "
                      >

                        <span>📊</span>

                        <span>View Analytics</span>

                      </Link>


                      {/* EDIT COURSE */}

                      <Link
                        to={`/courses/${course.id}/edit`}
                        className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          w-full
                          bg-green-600
                          hover:bg-green-700
                          text-white
                          px-4
                          py-3
                          rounded-xl
                          font-semibold
                          transition
                        "
                      >

                        <span>✏️</span>

                        <span>Edit Course</span>

                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

    </div>

  );

}