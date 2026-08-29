import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // ==============================
  // FETCH QUESTIONS
  // ==============================

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get(
          `/quizzes/${quizId}/questions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setQuestions(res.data);
      } catch (error) {
        console.error("Quiz error:", error);

        alert(
          error.response?.data?.message ||
            "Failed to load quiz"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  // ==============================
  // SELECT ANSWER
  // ==============================

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // ==============================
  // SUBMIT QUIZ
  // ==============================

  const submitQuiz = async (e) => {
    e.preventDefault();

    const answeredCount = Object.keys(answers).length;

    if (answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        "You have not answered every question. Submit anyway?"
      );

      if (!confirmSubmit) return;
    }

    try {
      const token = localStorage.getItem("token");

      /*
        Convert the answers object into an array
        using the exact question order.
      */

      const orderedAnswers = questions.map(
        (question) =>
          answers[question.id] || null
      );

      const res = await API.post(
        `/quizzes/${quizId}/submit`,
        {
          answers: orderedAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Submit quiz error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to submit quiz"
      );
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⏳</div>

          <h1 className="text-2xl font-bold">
            Loading Quiz...
          </h1>
        </div>
      </div>
    );
  }

  // ==============================
  // NO QUESTIONS
  // ==============================

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            No Questions Available
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This quiz does not have any questions yet.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
          >
            ← Back to Course
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // RESULT
  // ==============================

  if (submitted && result) {
    const passed = Number(result.percentage) >= 70;

    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">

          <div
            className={`rounded-3xl p-8 md:p-10 text-center shadow-2xl border ${
              passed
                ? "border-green-500"
                : "border-red-500"
            } bg-gray-100 dark:bg-gray-900`}
          >

            <div className="text-7xl mb-5">
              {passed ? "🎉" : "😔"}
            </div>

            <h1 className="text-4xl font-bold mb-3">
              {passed
                ? "Quiz Passed!"
                : "Quiz Not Passed"}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              {passed
                ? "Excellent work! You have successfully passed this quiz."
                : "Don't worry! Review the course material and try again."}
            </p>

            <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Your Score
              </p>

              <div
                className={`text-6xl font-bold ${
                  passed
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {result.score} / {result.totalQuestions}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Percentage
            </p>

            <p
              className={`text-4xl font-bold mb-8 ${
                passed
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {result.percentage}%
            </p>

            <div
              className={`rounded-xl p-4 mb-8 font-bold ${
                passed
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
              }`}
            >
              {passed
                ? "✅ You passed with a score of 70% or higher."
                : "❌ You need at least 70% to pass this quiz."}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold"
              >
                ← Back to Course
              </button>

              {!passed && (
                <button
                  onClick={() => {
                    setAnswers({});
                    setResult(null);
                    setSubmitted(false);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Retake Quiz 🔄
                </button>
              )}

              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-6 py-3 rounded-xl font-bold"
              >
                Dashboard
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // QUIZ
  // ==============================

  const answeredCount = Object.keys(answers).length;

  const progress =
    (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Quiz 📋
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Answer the questions and submit your quiz when you are finished.
          </p>
        </div>

        {/* PROGRESS */}

        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-5 mb-8">

          <div className="flex justify-between mb-3">
            <span className="font-semibold">
              Questions Answered
            </span>

            <span className="font-bold text-blue-600 dark:text-blue-400">
              {answeredCount} / {questions.length}
            </span>
          </div>

          <div className="w-full bg-gray-300 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* QUESTIONS */}

        <form onSubmit={submitQuiz}>
          <div className="space-y-8">

            {questions.map((question, index) => {

              const options = [
                ["A", question.option_a],
                ["B", question.option_b],
                ["C", question.option_c],
                ["D", question.option_d],
              ];

              return (
                <div
                  key={question.id}
                  className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg"
                >

                  <div className="text-blue-600 dark:text-blue-400 font-bold mb-3">
                    Question {index + 1}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold mb-6">
                    {question.question}
                  </h2>

                  <div className="space-y-3">

                    {options.map(([key, value]) => (
                      <label
                        key={key}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                          answers[question.id] === key
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                            : "border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800"
                        }`}
                      >

                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={key}
                          checked={
                            answers[question.id] === key
                          }
                          onChange={() =>
                            handleAnswerChange(
                              question.id,
                              key
                            )
                          }
                          className="w-5 h-5 accent-blue-600"
                        />

                        <span className="font-bold">
                          {key}.
                        </span>

                        <span>
                          {value}
                        </span>

                      </label>
                    ))}

                  </div>
                </div>
              );
            })}

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="w-full mt-10 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-bold transition"
          >
            Submit Quiz
          </button>

        </form>
      </div>
    </div>
  );
}