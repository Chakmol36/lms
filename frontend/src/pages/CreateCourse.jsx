import { useState } from "react";
import API from "../services/api";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      const res = await API.post(
        "/courses/create",
        formData
      );

      alert(res.data.message);

      setTitle("");
      setDescription("");
      setCategory("");
      setImage(null);

      document.getElementById(
        "courseImage"
      ).value = "";

    } catch (error) {
      console.log(
        "Course creation error:",
        error
      );

      console.log(
        "Server response:",
        error.response
      );

      alert(
        error.response?.data?.message ||
        "Something went wrong while creating the course."
      );
    }
  };

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
        onSubmit={handleSubmit}
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
          Create Course 📚
        </h1>


        {/* COURSE TITLE */}

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
            setTitle(e.target.value)
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
            focus:ring-blue-500
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
          placeholder="Course Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
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
            focus:ring-blue-500
          "
          rows="5"
        />


        {/* CATEGORY */}

        <label className="
          block
          text-sm
          font-semibold
          text-gray-700
          dark:text-gray-300
          mb-2
        ">
          Category
        </label>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
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
            mb-5
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >

          <option value="">
            Select Category
          </option>

          <option value="Web Development">
            Web Development
          </option>

          <option value="Mobile Development">
            Mobile Development
          </option>

          <option value="AI">
            AI
          </option>

          <option value="Cybersecurity">
            Cybersecurity
          </option>

          <option value="Database">
            Database
          </option>

          <option value="Programming">
            Programming
          </option>

        </select>


        {/* COURSE IMAGE */}

        <label className="
          block
          text-sm
          font-semibold
          text-gray-700
          dark:text-gray-300
          mb-2
        ">
          Course Image
        </label>

        <input
          id="courseImage"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
          className="
            w-full
            mb-6
            text-gray-700
            dark:text-gray-300
            file:mr-4
            file:py-2
            file:px-4
            file:rounded-lg
            file:border-0
            file:bg-blue-600
            file:text-white
            hover:file:bg-blue-700
            file:cursor-pointer
          "
        />


        {/* SUBMIT */}

        <button
          type="submit"
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            w-full
            font-bold
            transition
          "
        >
          Create Course
        </button>

      </form>

    </div>
  );
}