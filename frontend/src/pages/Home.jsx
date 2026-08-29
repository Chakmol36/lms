import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen flex flex-col items-center justify-center transition-colors duration-300">

      <h1 className="text-6xl font-bold mb-6">
        LMS 🎓
      </h1>

      <p className="text-gray-600 dark:text-gray-400 text-xl mb-10">
        Upgrade your learning experience.
      </p>

      <div className="flex gap-6">

        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
        >
          Register
        </Link>

      </div>

    </div>
  );
}