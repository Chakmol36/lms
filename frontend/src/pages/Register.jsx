import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);


  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // =========================================
  // REGISTER
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {

      alert("Please fill in all fields.");

      return;

    }


    if (formData.password.length < 6) {

      alert(
        "Password must be at least 6 characters long."
      );

      return;

    }


    try {

      setLoading(true);

      const res = await API.post(
        "/auth/register",
        formData
      );


      alert(
        res.data.message ||
        "Registration successful!"
      );


      setFormData({
        name: "",
        email: "",
        password: ""
      });


      // Send user to login

      navigate("/login");


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="
      min-h-screen
      bg-gray-100
      dark:bg-black
      text-gray-900
      dark:text-white
      flex
      items-center
      justify-center
      px-6
      py-10
      transition-colors
      duration-300
    ">


      {/* ========================================= */}
      {/* REGISTER CARD */}
      {/* ========================================= */}

      <div className="
        w-full
        max-w-md
        bg-white
        dark:bg-gray-900
        border
        border-gray-200
        dark:border-gray-800
        p-8
        md:p-10
        rounded-2xl
        shadow-xl
        dark:shadow-none
      ">


        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="text-center mb-8">

          <div className="
            w-16
            h-16
            mx-auto
            mb-5
            rounded-2xl
            bg-green-100
            dark:bg-green-900/40
            flex
            items-center
            justify-center
            text-3xl
          ">
            🎓
          </div>


          <h1 className="text-3xl font-bold">
            Create Account
          </h1>


          <p className="
            text-gray-600
            dark:text-gray-400
            mt-2
          ">
            Join our Learning Management System
          </p>

        </div>


        {/* ========================================= */}
        {/* FORM */}
        {/* ========================================= */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >


          {/* NAME */}

          <div>

            <label className="
              block
              text-sm
              font-semibold
              mb-2
            ">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              className="
                w-full
                p-3
                rounded-xl
                bg-gray-100
                dark:bg-gray-800
                border
                border-gray-300
                dark:border-gray-700
                text-gray-900
                dark:text-white
                placeholder-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                transition
              "
            />

          </div>


          {/* EMAIL */}

          <div>

            <label className="
              block
              text-sm
              font-semibold
              mb-2
            ">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="
                w-full
                p-3
                rounded-xl
                bg-gray-100
                dark:bg-gray-800
                border
                border-gray-300
                dark:border-gray-700
                text-gray-900
                dark:text-white
                placeholder-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                transition
              "
            />

          </div>


          {/* PASSWORD */}

          <div>

            <label className="
              block
              text-sm
              font-semibold
              mb-2
            ">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="
                w-full
                p-3
                rounded-xl
                bg-gray-100
                dark:bg-gray-800
                border
                border-gray-300
                dark:border-gray-700
                text-gray-900
                dark:text-white
                placeholder-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                transition
              "
            />

          </div>


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              bg-green-600
              hover:bg-green-700
              disabled:bg-green-800
              disabled:cursor-not-allowed
              text-white
              p-3
              rounded-xl
              font-bold
              transition
            "
          >

            {loading
              ? "Creating Account..."
              : "Create Account 🚀"}

          </button>

        </form>


        {/* ========================================= */}
        {/* LOGIN LINK */}
        {/* ========================================= */}

        <div className="
          text-center
          mt-7
          pt-6
          border-t
          border-gray-200
          dark:border-gray-800
        ">

          <p className="text-gray-600 dark:text-gray-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="
                text-green-600
                dark:text-green-400
                hover:text-green-700
                dark:hover:text-green-300
                font-bold
              "
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>

  );
}