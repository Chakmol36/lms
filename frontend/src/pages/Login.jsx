import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/login",
        formData
      );

      const token = res.data.token;

      console.log("Login token:", token);

      localStorage.setItem("token", token);

      console.log(
        "Token after saving:",
        localStorage.getItem("token")
      );

      // Decode JWT

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      console.log(
        "Logged in user:",
        payload
      );

      console.log(
        "Logged in role:",
        payload.role
      );

      // Redirect based on role

      if (payload.role === "instructor") {
        window.location.href = "/instructor";

      } else if (payload.role === "admin") {
        window.location.href = "/admin";

      } else {
        window.location.href = "/dashboard";
      }

    } catch (error) {
      console.log(
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Login failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen
      bg-gray-50 dark:bg-black
      text-gray-900 dark:text-white
      flex items-center justify-center
      px-6
      transition-colors duration-300"
    >

      <div className="w-full max-w-md">

        {/* LOGO / BRAND */}

        <div className="text-center mb-8">

          <div className="text-5xl mb-4">
            🎓
          </div>

          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Sign in to continue learning.
          </p>

        </div>


        {/* LOGIN CARD */}

        <div className="bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          p-8 md:p-10 rounded-2xl
          shadow-xl
          transition-colors duration-300"
        >

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >

            {/* EMAIL */}

            <div>

              <label className="block font-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full p-4 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition"
              />

            </div>


            {/* PASSWORD */}

            <div>

              <label className="block font-semibold mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full p-4 rounded-xl
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  transition"
              />

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600
                hover:bg-blue-700
                disabled:bg-blue-400
                text-white
                p-4
                rounded-xl
                font-bold
                text-lg
                transition
                mt-2"
            >

              {loading
                ? "Signing In..."
                : "Login"}

            </button>

          </form>

        </div>


        {/* FOOTER */}

        <p className="text-center text-gray-500 dark:text-gray-500 text-sm mt-6">
          Learning Management System
        </p>

      </div>

    </div>
  );
}