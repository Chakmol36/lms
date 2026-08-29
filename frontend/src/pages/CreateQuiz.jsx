import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const navigate = useNavigate();

  // ========================================
  // COURSES
  // ========================================

  const [courses, setCourses] = useState([]);

  // ========================================
  // QUIZ DATA
  // ========================================

  const [courseId, setCourseId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");

  // ========================================
  // CURRENT QUIZ
  // ========================================

  const [quizId, setQuizId] = useState(null);

  // ========================================
  // QUESTION DATA
  // ========================================

  const [question, setQuestion] = useState("");

  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");

  const [correctAnswer, setCorrectAnswer] =
    useState("A");

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [creatingQuiz, setCreatingQuiz] =
    useState(false);

  const [addingQuestion, setAddingQuestion] =
    useState(false);

  // ========================================
  // FETCH COURSES
  // ========================================

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);

      const token = localStorage.getItem("token");

      const res = await API.get("/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load courses."
      );

    } finally {
      setLoadingCourses(false);
    }
  };

  // ========================================
  // CREATE QUIZ
  // ========================================

  const createQuiz = async (e) => {
    e.preventDefault();

    if (!courseId) {
      alert("Please select a course.");
      return;
    }

    if (!quizTitle.trim()) {
      alert("Please enter a quiz title.");
      return;
    }

    try {
      setCreatingQuiz(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        "/quizzes/create",
        {
          course_id: courseId,
          title: quizTitle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        res.data.message ||
          "Quiz created successfully!"
      );

      setQuizId(res.data.quizId);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to create quiz."
      );

    } finally {
      setCreatingQuiz(false);
    }
  };

  // ========================================
  // ADD QUESTION
  // ========================================

  const addQuestion = async (e) => {
    e.preventDefault();

    if (!quizId) {
      alert("Please create the quiz first.");
      return;
    }

    if (
      !question.trim() ||
      !optionA.trim() ||
      !optionB.trim() ||
      !optionC.trim() ||
      !optionD.trim()
    ) {
      alert(
        "Please fill in all question fields."
      );
      return;
    }

    try {
      setAddingQuestion(true);

      const token = localStorage.getItem("token");

      const res = await API.post(
        `/quizzes/${quizId}/questions`,
        {
          question,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correctAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        res.data.message ||
          "Question added successfully!"
      );

      // Clear fields

      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswer("A");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to add question."
      );

    } finally {
      setAddingQuestion(false);
    }
  };

  // ========================================
  // FINISH QUIZ
  // ========================================

  const finishQuiz = () => {
    alert("Quiz created successfully! 🎉");

    navigate("/instructor");
  };

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white px-6 py-10 transition-colors duration-300">

      <div className="max-w-4xl mx-auto">

        {/* PAGE HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl md:text-5xl font-bold">
            Create Quiz 📝
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
            Create a quiz and add questions for your students.
          </p>

        </div>


        {/* ================================= */}
        {/* QUIZ CREATION */}
        {/* ================================= */}

        {!quizId && (

          <form
            onSubmit={createQuiz}
            className="bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              p-8 md:p-10 rounded-2xl shadow-xl"
          >

            <h2 className="text-2xl font-bold mb-7">
              Quiz Information
            </h2>


            {/* COURSE */}

            <label className="block font-semibold mb-2">
              Select Course
            </label>

            {loadingCourses ? (

              <div className="mb-6 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Loading courses...
              </div>

            ) : (

              <select
                value={courseId}
                onChange={(e) =>
                  setCourseId(e.target.value)
                }
                className="w-full p-4 mb-6 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500"
              >

                <option value="">
                  Select a course
                </option>

                {courses.map((course) => (

                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.title}
                  </option>

                ))}

              </select>

            )}


            {/* QUIZ TITLE */}

            <label className="block font-semibold mb-2">
              Quiz Title
            </label>

            <input
              type="text"
              placeholder="Example: JavaScript Fundamentals Quiz"
              value={quizTitle}
              onChange={(e) =>
                setQuizTitle(e.target.value)
              }
              className="w-full p-4 mb-7 rounded-xl
                bg-gray-100 dark:bg-gray-800
                border border-gray-300 dark:border-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500"
            />


            <button
              type="submit"
              disabled={creatingQuiz}
              className="bg-blue-600 hover:bg-blue-700
                disabled:bg-blue-400
                text-white px-6 py-4 rounded-xl
                font-bold w-full transition"
            >

              {creatingQuiz
                ? "Creating Quiz..."
                : "Create Quiz 📝"}

            </button>

          </form>

        )}


        {/* ================================= */}
        {/* QUIZ CREATED */}
        {/* ================================= */}

        {quizId && (

          <>

            {/* SUCCESS MESSAGE */}

            <div className="bg-green-50 dark:bg-green-950
              border border-green-300 dark:border-green-800
              p-6 rounded-2xl mb-8">

              <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                Quiz Created Successfully 🎉
              </h2>

              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Quiz ID:{" "}
                <span className="font-bold">
                  {quizId}
                </span>
              </p>

              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Add your questions below.
              </p>

            </div>


            {/* QUESTION FORM */}

            <form
              onSubmit={addQuestion}
              className="bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                p-8 md:p-10 rounded-2xl shadow-xl"
            >

              <h2 className="text-2xl font-bold mb-7">
                Add Question
              </h2>


              {/* QUESTION */}

              <label className="block font-semibold mb-2">
                Question
              </label>

              <textarea
                placeholder="Enter your question"
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                rows="4"
                className="w-full p-4 mb-6 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-green-500"
              />


              {/* OPTIONS */}

              <label className="block font-semibold mb-2">
                Option A
              </label>

              <input
                type="text"
                placeholder="Option A"
                value={optionA}
                onChange={(e) =>
                  setOptionA(e.target.value)
                }
                className="w-full p-4 mb-4 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-500"
              />


              <label className="block font-semibold mb-2">
                Option B
              </label>

              <input
                type="text"
                placeholder="Option B"
                value={optionB}
                onChange={(e) =>
                  setOptionB(e.target.value)
                }
                className="w-full p-4 mb-4 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-500"
              />


              <label className="block font-semibold mb-2">
                Option C
              </label>

              <input
                type="text"
                placeholder="Option C"
                value={optionC}
                onChange={(e) =>
                  setOptionC(e.target.value)
                }
                className="w-full p-4 mb-4 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-500"
              />


              <label className="block font-semibold mb-2">
                Option D
              </label>

              <input
                type="text"
                placeholder="Option D"
                value={optionD}
                onChange={(e) =>
                  setOptionD(e.target.value)
                }
                className="w-full p-4 mb-6 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-500"
              />


              {/* CORRECT ANSWER */}

              <label className="block font-semibold mb-2">
                Correct Answer
              </label>

              <select
                value={correctAnswer}
                onChange={(e) =>
                  setCorrectAnswer(e.target.value)
                }
                className="w-full p-4 mb-7 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white"
              >

                <option value="A">
                  A
                </option>

                <option value="B">
                  B
                </option>

                <option value="C">
                  C
                </option>

                <option value="D">
                  D
                </option>

              </select>


              {/* ADD QUESTION */}

              <button
                type="submit"
                disabled={addingQuestion}
                className="bg-green-600 hover:bg-green-700
                  disabled:bg-green-400
                  text-white px-6 py-4 rounded-xl
                  font-bold w-full transition"
              >

                {addingQuestion
                  ? "Adding Question..."
                  : "Add Question ➕"}

              </button>

            </form>


            {/* FINISH */}

            <button
              onClick={finishQuiz}
              className="mt-6 bg-blue-600 hover:bg-blue-700
                text-white px-6 py-4 rounded-xl
                font-bold w-full transition"
            >
              Finish Quiz ✅
            </button>

          </>

        )}

      </div>

    </div>
  );
}