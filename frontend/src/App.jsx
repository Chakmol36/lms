import { Routes, Route } from "react-router-dom";


// ========================================
// COMPONENTS
// ========================================

import Navbar from "./components/Navbar";

import ProtectedRoute
  from "./components/ProtectedRoute";

import InstructorRoute
  from "./components/InstructorRoute";

import AdminRoute
  from "./components/AdminRoute";


// ========================================
// PUBLIC PAGES
// ========================================

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";


// ========================================
// STUDENT PAGES
// ========================================

import Dashboard
  from "./pages/Dashboard";

import Courses
  from "./pages/Courses";

import CourseDetails
  from "./pages/CourseDetails";

import MyCourses
  from "./pages/MyCourses";

import LessonViewer
  from "./pages/LessonViewer";

import Quiz
  from "./pages/Quiz";

import QuizCenter
  from "./pages/QuizCenter";

import Certificate
  from "./pages/Certificate";

import Achievements
  from "./pages/Achievements";

import MyProgress
  from "./pages/MyProgress";


// ========================================
// INSTRUCTOR PAGES
// ========================================

import InstructorDashboard
  from "./pages/InstructorDashboard";

import CreateCourse
  from "./pages/CreateCourse";

import UpdateCourse
  from "./pages/UpdateCourse";

import AddLesson
  from "./pages/AddLesson";

import CreateQuiz
  from "./pages/CreateQuiz";

import CourseAnalytics
  from "./pages/CourseAnalytics";


// ========================================
// ADMIN
// ========================================

import AdminDashboard
  from "./pages/AdminDashboard";



function App() {

  return (

    <>

      {/* ================================= */}
      {/* NAVIGATION */}
      {/* ================================= */}

      <Navbar />


      <Routes>


        {/* ================================= */}
        {/* PUBLIC */}
        {/* ================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ================================= */}
        {/* STUDENT */}
        {/* ================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />


        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />


        <Route
          path="/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />


        {/* ================================= */}
        {/* LESSONS */}
        {/* ================================= */}

        <Route
          path="/courses/:id/learn"
          element={
            <ProtectedRoute>
              <LessonViewer />
            </ProtectedRoute>
          }
        />


        {/* ================================= */}
        {/* QUIZ CENTER */}
        {/* ================================= */}

        <Route
          path="/quiz-center"
          element={
            <ProtectedRoute>
              <QuizCenter />
            </ProtectedRoute>
          }
        />


        {/* ================================= */}
        {/* INDIVIDUAL QUIZ */}
        {/* ================================= */}

        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />


        {/* ================================= */}
        {/* ACHIEVEMENTS */}
        {/* ================================= */}

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />


        {/* ================================= */}
        {/* CERTIFICATE */}
        {/* ================================= */}

        <Route
          path="/certificate/:courseId"
          element={
            <ProtectedRoute>
              <Certificate />
            </ProtectedRoute>
          }
        />


        {/* ================================= */}
        {/* MY PROGRESS */}
        {/* ================================= */}

        <Route
          path="/my-progress"
          element={
            <ProtectedRoute>
              <MyProgress />
            </ProtectedRoute>
          }
        />


        {/* ================================= */}
        {/* INSTRUCTOR */}
        {/* ================================= */}

        <Route
          path="/instructor"
          element={
            <InstructorRoute>
              <InstructorDashboard />
            </InstructorRoute>
          }
        />


        <Route
          path="/create-course"
          element={
            <InstructorRoute>
              <CreateCourse />
            </InstructorRoute>
          }
        />


        <Route
          path="/courses/:id/edit"
          element={
            <InstructorRoute>
              <UpdateCourse />
            </InstructorRoute>
          }
        />


        <Route
          path="/courses/:id/add-lesson"
          element={
            <InstructorRoute>
              <AddLesson />
            </InstructorRoute>
          }
        />


        <Route
          path="/courses/:id/create-quiz"
          element={
            <InstructorRoute>
              <CreateQuiz />
            </InstructorRoute>
          }
        />


        <Route
          path="/courses/:id/analytics"
          element={
            <InstructorRoute>
              <CourseAnalytics />
            </InstructorRoute>
          }
        />


        {/* ================================= */}
        {/* ADMIN */}
        {/* ================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />


        {/* ================================= */}
        {/* 404 */}
        {/* ================================= */}

        <Route
          path="*"
          element={

            <div
              className="
                min-h-screen
                bg-gray-50 dark:bg-black
                text-gray-900 dark:text-white
                flex
                items-center
                justify-center
                px-6
              "
            >

              <div className="text-center max-w-lg">

                <div
                  className="
                    text-8xl
                    font-black
                    text-blue-600
                    dark:text-blue-500
                    mb-6
                  "
                >
                  404
                </div>

                <h1 className="text-3xl font-bold mb-3">
                  Page Not Found
                </h1>

                <p
                  className="
                    text-gray-600
                    dark:text-gray-400
                    mb-8
                  "
                >
                  The page you're looking for doesn't exist
                  or may have been moved.
                </p>

                <a
                  href="/dashboard"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    px-6
                    py-3
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-semibold
                    transition
                  "
                >
                  ← Back to Dashboard
                </a>

              </div>

            </div>

          }
        />

      </Routes>

    </>

  );
}


export default App;