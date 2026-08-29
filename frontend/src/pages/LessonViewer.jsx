import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

export default function LessonViewer() {
  const { id } = useParams();

  // ========================================
  // COURSE / LESSON STATES
  // ========================================

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);

  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const [lessonError, setLessonError] = useState("");

  // ========================================
  // QUIZ STATES
  // ========================================

  const [quizzes, setQuizzes] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [loadingQuiz, setLoadingQuiz] = useState(true);

  // ========================================
  // COMPLETION STATES
  // ========================================

  const [completingLesson, setCompletingLesson] = useState(null);

  // ========================================
  // LOAD EVERYTHING
  // ========================================

  useEffect(() => {
    fetchCourse();
    fetchLessons();
    fetchProgress();
    fetchQuizzes();
  }, [id]);

  // ========================================
  // FETCH COURSE
  // ========================================

  const fetchCourse = async () => {
    try {
      setLoadingCourse(true);

      const res = await API.get(`/courses/${id}`);

      setCourse(res.data);

    } catch (error) {
      console.error("Course error:", error);
    } finally {
      setLoadingCourse(false);
    }
  };

  // ========================================
  // FETCH LESSONS
  // ========================================

  const fetchLessons = async () => {
    try {
      setLoadingLessons(true);
      setLessonError("");

      const res = await API.get(
        `/courses/${id}/lessons`
      );

      console.log("Lessons returned:", res.data);

      if (Array.isArray(res.data)) {
        setLessons(res.data);
      } else {
        setLessons([]);

        setLessonError(
          "The server did not return the lessons correctly."
        );
      }

    } catch (error) {

      console.error(
        "Lessons error:",
        error
      );

      setLessons([]);

      setLessonError(
        error.response?.data?.message ||
        "Unable to load the lessons for this course."
      );

    } finally {
      setLoadingLessons(false);
    }
  };

  // ========================================
  // FETCH STUDENT PROGRESS
  // ========================================

  const fetchProgress = async () => {
    try {
      setLoadingProgress(true);

      const token =
        localStorage.getItem("token");

      const res = await API.get(
        `/progress/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Completed lessons:",
        res.data
      );

      if (Array.isArray(res.data)) {
        setCompletedLessons(res.data);
      } else {
        setCompletedLessons([]);
      }

    } catch (error) {

      console.error(
        "Progress error:",
        error
      );

      setCompletedLessons([]);

    } finally {
      setLoadingProgress(false);
    }
  };

  // ========================================
  // FETCH QUIZZES
  // ========================================

  const fetchQuizzes = async () => {
    try {
      setLoadingQuiz(true);

      const token =
        localStorage.getItem("token");

      const res = await API.get(
        `/quizzes/course/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Quizzes:",
        res.data
      );

      if (Array.isArray(res.data)) {
        setQuizzes(res.data);
      } else {
        setQuizzes([]);
      }

    } catch (error) {

      console.error(
        "Quiz error:",
        error
      );

      setQuizzes([]);

    } finally {
      setLoadingQuiz(false);
    }
  };

  // ========================================
  // CHECK QUIZ RESULT
  // ========================================

  const checkQuizResult = async (quizId) => {
    try {

      const token =
        localStorage.getItem("token");

      const res = await API.get(
        `/quizzes/${quizId}/my-result`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (res.data.completed) {

        setQuizResults(
          (previous) => ({
            ...previous,
            [quizId]:
              res.data.result,
          })
        );

      } else {

        setQuizResults(
          (previous) => ({
            ...previous,
            [quizId]: null,
          })
        );

      }

    } catch (error) {

      console.error(
        "Quiz result error:",
        error
      );

    }
  };

  // ========================================
  // CHECK ALL QUIZ RESULTS
  // ========================================

  useEffect(() => {

    if (
      progressPercentage === 100 &&
      quizzes.length > 0
    ) {

      quizzes.forEach(
        (quiz) => {
          checkQuizResult(quiz.id);
        }
      );

    }

  }, [
    quizzes,
    completedLessons,
    lessons.length,
  ]);

  // ========================================
  // MARK LESSON COMPLETE
  // ========================================

  const markComplete = async (lessonId) => {

    try {

      setCompletingLesson(lessonId);

      const token =
        localStorage.getItem("token");

      await API.post(
        "/progress",
        {
          lesson_id: lessonId,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      // ======================================
      // UPDATE UI IMMEDIATELY
      // ======================================

      setCompletedLessons(
        (previous) => {

          const alreadyCompleted =
            previous.some(
              (item) =>
                Number(item.lesson_id) ===
                Number(lessonId)
            );

          if (alreadyCompleted) {
            return previous;
          }

          return [
            ...previous,
            {
              lesson_id: lessonId,
              completed: true,
            },
          ];

        }
      );

      alert(
        "Lesson completed successfully! 🎉"
      );

    } catch (error) {

      console.error(
        "Complete lesson error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to save lesson progress."
      );

    } finally {

      setCompletingLesson(null);

    }
  };

  // ========================================
  // CALCULATE PROGRESS
  // ========================================

  const progressPercentage =
    lessons.length > 0
      ? Math.min(
          100,
          Math.round(
            (
              completedLessons.length /
              lessons.length
            ) * 100
          )
        )
      : 0;

  // ========================================
  // ALL LESSONS COMPLETED
  // ========================================

  const allLessonsCompleted =
    lessons.length > 0 &&
    completedLessons.length >=
      lessons.length;

  // ========================================
  // CHECK IF QUIZ PASSED
  // ========================================

  const hasPassedQuiz =
    quizzes.some(
      (quiz) => {

        const result =
          quizResults[quiz.id];

        return (
          result &&
          Number(result.percentage) >= 70
        );

      }
    );

  // ========================================
  // COURSE LOADING
  // ========================================

  if (loadingCourse) {

    return (
      <div className="
        min-h-screen
        bg-white
        dark:bg-black
        text-gray-900
        dark:text-white
        flex
        items-center
        justify-center
      ">

        <div className="text-center">

          <div className="
            text-5xl
            mb-4
          ">
            📚
          </div>

          <h1 className="
            text-2xl
            font-bold
          ">
            Loading course...
          </h1>

        </div>

      </div>
    );
  }

  // ========================================
  // COURSE NOT FOUND
  // ========================================

  if (!course) {

    return (
      <div className="
        min-h-screen
        bg-white
        dark:bg-black
        text-gray-900
        dark:text-white
        flex
        items-center
        justify-center
        p-6
      ">

        <div className="
          text-center
          max-w-md
        ">

          <div className="
            text-6xl
            mb-5
          ">
            ⚠️
          </div>

          <h1 className="
            text-3xl
            font-bold
            mb-3
          ">
            Course not found
          </h1>

          <p className="
            text-gray-600
            dark:text-gray-400
            mb-6
          ">
            We couldn't load this course.
          </p>

          <Link
            to="/my-courses"
            className="
              inline-block
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-xl
              font-bold
            "
          >
            ← Back to My Courses
          </Link>

        </div>

      </div>
    );
  }

  // ========================================
  // MAIN PAGE
  // ========================================

  return (

    <div className="
      bg-gray-100
      dark:bg-black
      text-gray-900
      dark:text-white
      min-h-screen
      p-6
      md:p-10
      transition-colors
      duration-300
    ">

      <div className="
        max-w-5xl
        mx-auto
      ">

        {/* ================================= */}
        {/* COURSE IMAGE */}
        {/* ================================= */}

        {course.image ? (

          <img
            src={`http://localhost:5000${course.image}`}
            alt={course.title}
            className="
              w-full
              h-[400px]
              object-cover
              rounded-2xl
              mb-8
            "
          />

        ) : (

          <div className="
            w-full
            h-[300px]
            rounded-2xl
            mb-8
            bg-gray-300
            dark:bg-gray-900
            flex
            items-center
            justify-center
          ">

            <span className="
              text-gray-500
              dark:text-gray-400
              text-lg
            ">
              No course image
            </span>

          </div>

        )}

        {/* ================================= */}
        {/* COURSE TITLE */}
        {/* ================================= */}

        <h1 className="
          text-4xl
          md:text-5xl
          font-bold
          mb-4
        ">
          {course.title}
        </h1>

        {/* ================================= */}
        {/* DESCRIPTION */}
        {/* ================================= */}

        <p className="
          text-gray-600
          dark:text-gray-400
          text-lg
          mb-8
        ">
          {course.description}
        </p>

        {/* ================================= */}
        {/* PROGRESS */}
        {/* ================================= */}

        <div className="
          mb-10
          bg-white
          dark:bg-gray-900
          p-6
          rounded-2xl
          border
          border-gray-200
          dark:border-gray-800
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-3
          ">

            <span className="
              font-bold
              text-lg
            ">
              Course Progress
            </span>

            <span className="
              font-bold
              text-green-600
              dark:text-green-400
              text-lg
            ">
              {progressPercentage}%
            </span>

          </div>

          <div className="
            w-full
            bg-gray-300
            dark:bg-gray-800
            h-4
            rounded-full
            overflow-hidden
          ">

            <div
              className="
                bg-green-500
                h-4
                rounded-full
                transition-all
                duration-500
              "
              style={{
                width:
                  `${progressPercentage}%`,
              }}
            />

          </div>

          <p className="
            mt-3
            text-sm
            text-gray-500
            dark:text-gray-400
          ">
            {completedLessons.length} of{" "}
            {lessons.length} lessons completed
          </p>

        </div>

        {/* ================================= */}
        {/* LESSONS */}
        {/* ================================= */}

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
            Lessons 📚
          </h2>

        </div>

        {/* ================================= */}
        {/* LOADING LESSONS */}
        {/* ================================= */}

        {loadingLessons && (

          <div className="
            bg-white
            dark:bg-gray-900
            p-8
            rounded-2xl
            text-center
            border
            border-gray-200
            dark:border-gray-800
          ">

            <div className="
              text-4xl
              mb-3
            ">
              📖
            </div>

            <p className="
              text-gray-600
              dark:text-gray-400
            ">
              Loading lessons...
            </p>

          </div>

        )}

        {/* ================================= */}
        {/* LESSON ERROR */}
        {/* ================================= */}

        {!loadingLessons &&
          lessonError && (

            <div className="
              bg-red-50
              dark:bg-red-950/30
              border
              border-red-200
              dark:border-red-900
              rounded-2xl
              p-6
              mb-8
            ">

              <h3 className="
                text-xl
                font-bold
                text-red-700
                dark:text-red-400
                mb-2
              ">
                Unable to load lessons
              </h3>

              <p className="
                text-red-600
                dark:text-red-400
                mb-4
              ">
                {lessonError}
              </p>

              <button
                onClick={fetchLessons}
                className="
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  px-5
                  py-2
                  rounded-lg
                  font-semibold
                "
              >
                Try Again
              </button>

            </div>

          )}

        {/* ================================= */}
        {/* NO LESSONS */}
        {/* ================================= */}

        {!loadingLessons &&
          !lessonError &&
          lessons.length === 0 && (

            <div className="
              bg-yellow-50
              dark:bg-yellow-950/30
              border
              border-yellow-200
              dark:border-yellow-900
              rounded-2xl
              p-8
              text-center
            ">

              <div className="
                text-5xl
                mb-4
              ">
                📚
              </div>

              <h3 className="
                text-2xl
                font-bold
                mb-2
              ">
                No lessons yet
              </h3>

              <p className="
                text-gray-600
                dark:text-gray-400
              ">
                This course doesn't have any
                lessons yet. An instructor needs
                to add lessons before you can
                start learning.
              </p>

            </div>

          )}

        {/* ================================= */}
        {/* LESSON LIST */}
        {/* ================================= */}

        {!loadingLessons &&
          lessons.length > 0 && (

            <div className="space-y-8">

              {lessons.map(
                (lesson, index) => {

                  const completed =
                    completedLessons.some(
                      (item) =>
                        Number(
                          item.lesson_id
                        ) ===
                        Number(lesson.id)
                    );

                  return (

                    <div
                      key={lesson.id}
                      className="
                        bg-white
                        dark:bg-gray-900
                        border
                        border-gray-200
                        dark:border-gray-800
                        p-6
                        rounded-2xl
                        shadow-lg
                      "
                    >

                      {/* LESSON HEADER */}

                      <div className="
                        flex
                        flex-col
                        md:flex-row
                        md:justify-between
                        md:items-center
                        gap-3
                        mb-5
                      ">

                        <div>

                          <p className="
                            text-sm
                            text-blue-600
                            dark:text-blue-400
                            font-semibold
                            mb-1
                          ">
                            Lesson {index + 1}
                          </p>

                          <h3 className="
                            text-2xl
                            font-bold
                          ">
                            {lesson.title}
                          </h3>

                        </div>

                        {/* COMPLETED BADGE */}

                        {completed && (

                          <span className="
                            inline-flex
                            items-center
                            gap-2
                            bg-green-100
                            dark:bg-green-950
                            text-green-700
                            dark:text-green-400
                            px-4
                            py-2
                            rounded-full
                            font-bold
                          ">
                            ✓ Completed
                          </span>

                        )}

                      </div>

                      {/* VIDEO */}

                      {lesson.video ? (

                        <video
                          controls
                          className="
                            w-full
                            rounded-xl
                            bg-black
                            mb-5
                          "
                          src={`http://localhost:5000${lesson.video}`}
                        />

                      ) : (

                        <div className="
                          bg-gray-100
                          dark:bg-gray-800
                          rounded-xl
                          p-8
                          text-center
                          mb-5
                        ">
                          No video available
                        </div>

                      )}

                      {/* ================================= */}
                      {/* COMPLETION ACTION */}
                      {/* ================================= */}

                      {!completed ? (

                        <div className="
                          border-t
                          border-gray-200
                          dark:border-gray-800
                          pt-5
                        ">

                          <p className="
                            text-gray-600
                            dark:text-gray-400
                            mb-3
                          ">
                            Finished this lesson?
                            Mark it as completed to
                            update your course progress.
                          </p>

                          <button
                            onClick={() =>
                              markComplete(
                                lesson.id
                              )
                            }
                            disabled={
                              completingLesson ===
                              lesson.id
                            }
                            className="
                              w-full
                              md:w-auto
                              bg-green-600
                              hover:bg-green-700
                              disabled:bg-gray-500
                              text-white
                              px-6
                              py-3
                              rounded-xl
                              font-bold
                              transition
                            "
                          >

                            {completingLesson ===
                            lesson.id
                              ? "Saving progress..."
                              : "✓ Mark Lesson as Completed"}

                          </button>

                        </div>

                      ) : (

                        <div className="
                          border-t
                          border-gray-200
                          dark:border-gray-800
                          pt-5
                        ">

                          <div className="
                            bg-green-50
                            dark:bg-green-950/30
                            border
                            border-green-200
                            dark:border-green-900
                            rounded-xl
                            p-4
                          ">

                            <p className="
                              text-green-700
                              dark:text-green-400
                              font-bold
                            ">
                              ✓ You have completed
                              this lesson.
                            </p>

                          </div>

                        </div>

                      )}

                    </div>

                  );

                }
              )}

            </div>

          )}

        {/* ================================= */}
        {/* COURSE COMPLETE MESSAGE */}
        {/* ================================= */}

        {allLessonsCompleted && (

          <div className="
            mt-10
            bg-green-50
            dark:bg-green-950/30
            border
            border-green-200
            dark:border-green-900
            rounded-2xl
            p-6
          ">

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                  text-green-700
                  dark:text-green-400
                  mb-2
                ">
                  🎉 All Lessons Completed!
                </h2>

                <p className="
                  text-green-700
                  dark:text-green-400
                ">
                  Great job! You have completed
                  every lesson in this course.
                  You can now take the course quiz.
                </p>

              </div>

              {quizzes.length > 0 && (

                <a
                  href={`#course-quiz`}
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
                    whitespace-nowrap
                  "
                >
                  Go to Quiz ↓
                </a>

              )}

            </div>

          </div>

        )}

        {/* ================================= */}
        {/* QUIZ SECTION */}
        {/* ================================= */}

        {allLessonsCompleted && (

          <div
            id="course-quiz"
            className="
              mt-12
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              p-6
              md:p-8
              rounded-2xl
              shadow-lg
            "
          >

            <h2 className="
              text-3xl
              font-bold
              mb-3
            ">
              Course Quiz 📝
            </h2>

            <p className="
              text-gray-600
              dark:text-gray-400
              mb-6
            ">
              You have completed all the lessons.
              You can now take the quiz.
            </p>

            {/* LOADING */}

            {loadingQuiz && (

              <p className="
                text-gray-600
                dark:text-gray-400
              ">
                Loading quiz...
              </p>

            )}

            {/* NO QUIZ */}

            {!loadingQuiz &&
              quizzes.length === 0 && (

                <div className="
                  bg-yellow-50
                  dark:bg-yellow-950/30
                  border
                  border-yellow-200
                  dark:border-yellow-900
                  rounded-xl
                  p-5
                ">

                  <p className="
                    text-yellow-700
                    dark:text-yellow-400
                    font-semibold
                  ">
                    No quiz has been added to
                    this course yet.
                  </p>

                </div>

              )}

            {/* QUIZZES */}

            {!loadingQuiz &&
              quizzes.map(
                (quiz) => {

                  const result =
                    quizResults[quiz.id];

                  return (

                    <div
                      key={quiz.id}
                      className="
                        bg-gray-100
                        dark:bg-gray-800
                        border
                        border-gray-200
                        dark:border-gray-700
                        p-6
                        rounded-xl
                        mb-4
                      "
                    >

                      <h3 className="
                        text-2xl
                        font-bold
                        mb-3
                      ">
                        {quiz.title}
                      </h3>

                      {/* NOT TAKEN */}

                      {!result && (

                        <div>

                          <p className="
                            text-gray-600
                            dark:text-gray-400
                            mb-4
                          ">
                            You haven't completed
                            this quiz yet.
                          </p>

                          <Link
                            to={`/quiz/${quiz.id}`}
                            className="
                              inline-block
                              bg-blue-600
                              hover:bg-blue-700
                              text-white
                              px-6
                              py-3
                              rounded-xl
                              font-bold
                            "
                          >
                            Take Quiz 📝
                          </Link>

                        </div>

                      )}

                      {/* PASSED */}

                      {result &&
                        Number(
                          result.percentage
                        ) >= 70 && (

                          <div>

                            <p className="
                              text-green-600
                              dark:text-green-400
                              font-bold
                              text-xl
                              mb-3
                            ">
                              ✓ Quiz Passed!
                            </p>

                            <p className="mb-5">
                              Score:{" "}
                              {result.score}/
                              {result.total_questions}
                              {" "}
                              (
                              {result.percentage}
                              %)
                            </p>

                            <Link
                              to={`/certificate/${id}`}
                              className="
                                inline-block
                                bg-yellow-500
                                hover:bg-yellow-600
                                text-white
                                px-6
                                py-3
                                rounded-xl
                                font-bold
                              "
                            >
                              View Certificate 🏆
                            </Link>

                          </div>

                        )}

                      {/* FAILED */}

                      {result &&
                        Number(
                          result.percentage
                        ) < 70 && (

                          <div>

                            <p className="
                              text-red-600
                              dark:text-red-400
                              font-bold
                              text-xl
                              mb-3
                            ">
                              ✗ Quiz Not Passed
                            </p>

                            <p className="mb-5">
                              Score:{" "}
                              {result.score}/
                              {result.total_questions}
                              {" "}
                              (
                              {result.percentage}
                              %)
                            </p>

                            <Link
                              to={`/quiz/${quiz.id}`}
                              className="
                                inline-block
                                bg-red-600
                                hover:bg-red-700
                                text-white
                                px-6
                                py-3
                                rounded-xl
                                font-bold
                              "
                            >
                              Retake Quiz 🔄
                            </Link>

                          </div>

                        )}

                    </div>

                  );

                }
              )}

          </div>

        )}

        {/* ================================= */}
        {/* COURSE FINISHED */}
        {/* ================================= */}

        {allLessonsCompleted &&
          hasPassedQuiz && (

            <div className="
              mt-8
              text-center
              bg-yellow-50
              dark:bg-yellow-950/30
              border
              border-yellow-200
              dark:border-yellow-900
              rounded-2xl
              p-8
            ">

              <div className="
                text-5xl
                mb-4
              ">
                🏆
              </div>

              <h2 className="
                text-3xl
                font-bold
                mb-3
              ">
                Course Completed!
              </h2>

              <p className="
                text-gray-600
                dark:text-gray-400
                mb-6
              ">
                Congratulations! You completed
                all the lessons and passed the quiz.
                Your certificate is ready.
              </p>

              <Link
                to={`/certificate/${id}`}
                className="
                  inline-block
                  bg-yellow-500
                  hover:bg-yellow-600
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  font-bold
                  text-lg
                "
              >
                🏆 View My Certificate
              </Link>

            </div>

          )}

      </div>

    </div>

  );
}