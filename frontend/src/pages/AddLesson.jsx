import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AddLesson() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a lesson title.");
      return;
    }

    if (!video) {
      alert("Please select a video.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("video", video);

      const res = await API.post(
        `/courses/${id}/lessons`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message || "Lesson uploaded successfully!");

      setTitle("");
      setVideo(null);

      const fileInput = document.getElementById("lessonVideo");

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      console.log("Add lesson error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to upload lesson."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white px-6 py-10 transition-colors duration-300">

      <div className="max-w-2xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-4xl md:text-5xl font-bold">
            Add Lesson 🎥
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
            Upload a new video lesson to your course.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 md:p-10 rounded-2xl shadow-xl transition-colors duration-300"
        >

          {/* LESSON TITLE */}

          <div className="mb-6">

            <label className="block font-semibold mb-2">
              Lesson Title
            </label>

            <input
              type="text"
              placeholder="Example: Introduction to JavaScript"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
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


          {/* VIDEO */}

          <div className="mb-8">

            <label className="block font-semibold mb-2">
              Lesson Video
            </label>

            <input
              id="lessonVideo"
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideo(e.target.files[0])
              }
              className="w-full p-3 rounded-xl
                bg-gray-100 dark:bg-gray-800
                border border-gray-300 dark:border-gray-700
                text-gray-700 dark:text-gray-300
                file:mr-4
                file:py-2
                file:px-4
                file:rounded-lg
                file:border-0
                file:bg-blue-600
                file:text-white
                hover:file:bg-blue-700"
            />

            {video && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Selected: {video.name}
              </p>
            )}

          </div>


          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700
              disabled:bg-blue-400
              text-white px-6 py-4 rounded-xl
              font-bold text-lg
              transition"
          >

            {loading
              ? "Uploading Lesson..."
              : "Upload Lesson 🎥"}

          </button>


          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate("/instructor")}
            className="w-full mt-4
              bg-gray-200 dark:bg-gray-800
              hover:bg-gray-300 dark:hover:bg-gray-700
              text-gray-900 dark:text-white
              px-6 py-3 rounded-xl
              font-semibold transition"
          >
            Back to Dashboard
          </button>

        </form>

      </div>

    </div>
  );
}