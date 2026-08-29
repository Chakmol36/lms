import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function Certificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CERTIFICATE
  // ==========================================

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("You must be logged in to view your certificate.");
          return;
        }

        const response = await API.get(
          `/certificates/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCertificate(response.data);
      } catch (error) {
        console.error("Certificate error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your certificate."
        );
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCertificate();
    } else {
      setError("No course was specified.");
      setLoading(false);
    }
  }, [courseId]);

  // ==========================================
  // PRINT
  // ==========================================

  const printCertificate = () => {
    window.print();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="text-5xl mb-5">🎓</div>

          <h1 className="text-2xl font-bold mb-2">
            Preparing your certificate...
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white flex items-center justify-center p-6 transition-colors duration-300">
        <div className="max-w-lg w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl p-10 text-center">

          <div className="text-6xl mb-5">
            🎓
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Certificate Unavailable
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <button
              onClick={() => navigate(`/courses/${courseId}/learn`)}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                transition
              "
            >
              Back to Course
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="
                bg-gray-200
                hover:bg-gray-300
                dark:bg-gray-800
                dark:hover:bg-gray-700
                px-6
                py-3
                rounded-xl
                font-semibold
                transition
              "
            >
              Dashboard
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CERTIFICATE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4 md:px-8 transition-colors duration-300">

      {/* HEADER */}

      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">

        <button
          onClick={() => navigate("/dashboard")}
          className="
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            px-5
            py-3
            rounded-xl
            font-semibold
            hover:bg-gray-100
            dark:hover:bg-gray-800
            transition
          "
        >
          ← Dashboard
        </button>

        <button
          onClick={printCertificate}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            font-bold
            shadow-lg
            transition
          "
        >
          🖨️ Print / Save Certificate
        </button>

      </div>

      {/* CERTIFICATE */}

      <div
        id="certificate"
        className="
          max-w-6xl
          mx-auto
          bg-white
          text-gray-900
          border-[12px]
          border-blue-700
          shadow-2xl
          min-h-[650px]
          p-8
          md:p-16
          flex
          flex-col
          items-center
          justify-center
          text-center
          relative
        "
      >

        {/* Decorative corner */}

        <div className="absolute top-5 left-5 text-3xl">
          ✦
        </div>

        <div className="absolute top-5 right-5 text-3xl">
          ✦
        </div>

        <div className="absolute bottom-5 left-5 text-3xl">
          ✦
        </div>

        <div className="absolute bottom-5 right-5 text-3xl">
          ✦
        </div>

        {/* BRAND */}

        <p className="uppercase tracking-[0.35em] text-blue-700 font-bold text-sm md:text-base mb-6">
          Learning Management System
        </p>

        {/* TITLE */}

        <h1 className="text-4xl md:text-6xl font-extrabold mb-5">
          Certificate
        </h1>

        <h2 className="text-2xl md:text-4xl font-semibold text-gray-700 mb-10">
          of Completion
        </h2>

        {/* PRESENTED TO */}

        <p className="text-lg md:text-xl text-gray-600 mb-5">
          This certificate is proudly presented to
        </p>

        {/* STUDENT */}

        <h2 className="text-4xl md:text-5xl font-bold text-blue-700 border-b-2 border-gray-400 px-8 md:px-16 pb-3 mb-8">
          {certificate.studentName}
        </h2>

        {/* COURSE */}

        <p className="text-lg md:text-xl text-gray-600 mb-4">
          for successfully completing
        </p>

        <h3 className="text-2xl md:text-4xl font-bold mb-10">
          {certificate.courseTitle}
        </h3>

        {/* DETAILS */}

        <div className="flex flex-col md:flex-row gap-6 md:gap-20 text-sm md:text-base text-gray-600 mb-10">

          <div>
            <p className="font-semibold text-gray-900">
              Completion Date
            </p>

            <p>
              {new Date(
                certificate.completionDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              Certificate ID
            </p>

            <p>
              {certificate.certificateId}
            </p>
          </div>

        </div>

        {/* SIGNATURE */}

        <div className="mt-5">

          <div className="w-48 border-b border-gray-500 mb-2"></div>

          <p className="font-semibold">
            LMS Certification
          </p>

          <p className="text-sm text-gray-500">
            Learning Management System
          </p>

        </div>

      </div>

      {/* FOOTER */}

      <p className="text-center text-gray-500 dark:text-gray-500 text-sm mt-6 print:hidden">
        Congratulations on completing your course! 🎉
      </p>

    </div>
  );
}