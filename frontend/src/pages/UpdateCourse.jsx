import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import API from "../services/api";

export default function UpdateCourse() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // FETCH COURSE
  // ========================================

  useEffect(() => {

    fetchCourse();

  }, [id]);


  const fetchCourse = async () => {

    try {

      setLoading(true);

      const res =
        await API.get(
          `/courses/${id}`
        );

      setTitle(
        res.data.title || ""
      );

      setDescription(
        res.data.description || ""
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to load course."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // UPDATE COURSE
  // ========================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!title.trim() ||
          !description.trim()) {

        alert(
          "Please fill in all fields."
        );

        return;

      }

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await API.put(

          `/courses/${id}`,

          {
            title,
            description,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );

        alert(
          "Course updated!"
        );

        navigate(
          "/instructor"
        );

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data?.message ||
          "Failed to update course."
        );

      }

    };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="
        bg-gray-100
        dark:bg-black
        text-gray-900
        dark:text-white
        min-h-screen
        flex
        items-center
        justify-center
      ">

        <div className="
          text-center
        ">

          <div className="
            text-5xl
            mb-4
          ">
            ⏳
          </div>

          <h1 className="
            text-2xl
            font-bold
          ">
            Loading Course...
          </h1>

        </div>

      </div>

    );

  }


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
      flex
      items-center
      justify-center
      p-6
      transition-colors
      duration-300
    ">

      <form
        onSubmit={
          handleSubmit
        }
        className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          p-8
          md:p-10
          rounded-2xl
          w-full
          max-w-[500px]
          shadow-xl
          dark:shadow-none
        "
      >

        <h1 className="
          text-4xl
          font-bold
          mb-8
        ">
          Update Course ✏️
        </h1>


        {/* TITLE */}

        <label className="
          block
          text-sm
          font-semibold
          text-gray-700
          dark:text-gray-300
          mb-2
        ">
          Course Title
        </label>

        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded-lg
            bg-gray-100
            dark:bg-gray-800
            border
            border-gray-300
            dark:border-gray-700
            text-gray-900
            dark:text-white
            placeholder-gray-500
            mb-5
            outline-none
            focus:ring-2
            focus:ring-yellow-500
          "
        />


        {/* DESCRIPTION */}

        <label className="
          block
          text-sm
          font-semibold
          text-gray-700
          dark:text-gray-300
          mb-2
        ">
          Course Description
        </label>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded-lg
            bg-gray-100
            dark:bg-gray-800
            border
            border-gray-300
            dark:border-gray-700
            text-gray-900
            dark:text-white
            placeholder-gray-500
            mb-6
            outline-none
            focus:ring-2
            focus:ring-yellow-500
          "
          rows="6"
        />


        {/* UPDATE */}

        <button
          type="submit"
          className="
            bg-yellow-600
            hover:bg-yellow-700
            text-white
            px-6
            py-3
            rounded-xl
            w-full
            font-bold
            transition
          "
        >
          Update Course
        </button>

      </form>

    </div>

  );
}