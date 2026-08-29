import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  let currentUserId = null;

  // =========================================
  // GET CURRENT ADMIN ID FROM JWT
  // =========================================

  try {
    if (token) {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      currentUserId = payload.id;
    }
  } catch (error) {
    console.error(
      "Failed to read token:",
      error
    );
  }

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================================
  // FETCH USERS + COURSES
  // =========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [usersRes, coursesRes] =
        await Promise.all([
          API.get(
            "/admin/users",
            authConfig
          ),

          API.get(
            "/admin/courses",
            authConfig
          ),
        ]);

      setUsers(usersRes.data);
      setCourses(coursesRes.data);

    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to load admin dashboard"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================
  // STATISTICS
  // =========================================

  const students = users.filter(
    (user) =>
      user.role === "student"
  ).length;

  const instructors = users.filter(
    (user) =>
      user.role === "instructor"
  ).length;

  const admins = users.filter(
    (user) =>
      user.role === "admin"
  ).length;

  // =========================================
  // CHANGE USER ROLE
  // =========================================

  const changeRole = async (
    id,
    newRole
  ) => {
    try {
      await API.put(
        `/admin/users/${id}/role`,
        {
          role: newRole,
        },
        authConfig
      );

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );

    } catch (error) {
      console.error(
        "Role update error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update role"
      );
    }
  };

  // =========================================
  // DELETE USER
  // =========================================

  const deleteUser = async (id) => {
    if (
      Number(id) ===
      Number(currentUserId)
    ) {
      alert(
        "You cannot delete your own admin account."
      );

      return;
    }

    const user = users.find(
      (user) =>
        user.id === id
    );

    if (!user) return;

    const confirmed =
      window.confirm(
        `Delete ${user.name} (${user.email})?`
      );

    if (!confirmed) return;

    try {
      await API.delete(
        `/admin/users/${id}`,
        authConfig
      );

      setUsers((prev) =>
        prev.filter(
          (user) =>
            user.id !== id
        )
      );

    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete user"
      );
    }
  };

  // =========================================
  // DELETE COURSE
  // =========================================

  const deleteCourse = async (id) => {
    const course = courses.find(
      (course) =>
        course.id === id
    );

    if (!course) return;

    const confirmed =
      window.confirm(
        `Delete course "${course.title}"?`
      );

    if (!confirmed) return;

    try {
      await API.delete(
        `/admin/courses/${id}`,
        authConfig
      );

      setCourses((prev) =>
        prev.filter(
          (course) =>
            course.id !== id
        )
      );

    } catch (error) {
      console.error(
        "Delete course error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete course"
      );
    }
  };

  // =========================================
  // LOADING SCREEN
  // =========================================

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

        <div className="text-center">

          <div className="text-5xl mb-4">
            ⚙️
          </div>

          <h1 className="text-2xl font-bold">
            Loading Admin Dashboard...
          </h1>

          <p className="
            text-gray-500
            dark:text-gray-400
            mt-2
          ">
            Please wait
          </p>

        </div>

      </div>
    );
  }

  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <div className="
      bg-gray-100
      dark:bg-black
      text-gray-900
      dark:text-white
      min-h-screen
      p-6
      md:p-10
      transition-colors
      duration-300
    ">

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl md:text-5xl font-bold">
          🛠️ Admin Dashboard
        </h1>

        <p className="
          text-gray-600
          dark:text-gray-400
          mt-2
        ">
          Manage users, instructors,
          courses and your LMS.
        </p>

      </div>


      {/* STATISTICS */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-5
        gap-5
        mb-12
      ">

        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-2xl
          p-6
          shadow-sm
          dark:shadow-none
        ">
          <p className="
            text-gray-500
            dark:text-gray-400
          ">
            Total Users
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {users.length}
          </h2>
        </div>


        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-2xl
          p-6
          shadow-sm
          dark:shadow-none
        ">
          <p className="
            text-gray-500
            dark:text-gray-400
          ">
            Students
          </p>

          <h2 className="
            text-4xl
            font-bold
            text-blue-500
            dark:text-blue-400
            mt-2
          ">
            {students}
          </h2>
        </div>


        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-2xl
          p-6
          shadow-sm
          dark:shadow-none
        ">
          <p className="
            text-gray-500
            dark:text-gray-400
          ">
            Instructors
          </p>

          <h2 className="
            text-4xl
            font-bold
            text-purple-500
            dark:text-purple-400
            mt-2
          ">
            {instructors}
          </h2>
        </div>


        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-2xl
          p-6
          shadow-sm
          dark:shadow-none
        ">
          <p className="
            text-gray-500
            dark:text-gray-400
          ">
            Administrators
          </p>

          <h2 className="
            text-4xl
            font-bold
            text-red-500
            dark:text-red-400
            mt-2
          ">
            {admins}
          </h2>
        </div>


        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-2xl
          p-6
          shadow-sm
          dark:shadow-none
        ">
          <p className="
            text-gray-500
            dark:text-gray-400
          ">
            Courses
          </p>

          <h2 className="
            text-4xl
            font-bold
            text-green-500
            dark:text-green-400
            mt-2
          ">
            {courses.length}
          </h2>
        </div>

      </div>


      {/* USER MANAGEMENT */}

      <section className="mb-12">

        <div className="mb-5">

          <h2 className="text-2xl font-bold">
            👥 User Management
          </h2>

          <p className="
            text-gray-600
            dark:text-gray-400
            mt-1
          ">
            Manage accounts and user roles.
          </p>

        </div>


        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-2xl
          overflow-hidden
          shadow-sm
          dark:shadow-none
        ">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="
                bg-gray-200
                dark:bg-gray-800
              ">

                <tr>

                  <th className="p-4 text-left">
                    Name
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-left">
                    Role
                  </th>

                  <th className="p-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="
                        p-8
                        text-center
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      No users found.
                    </td>

                  </tr>

                ) : (

                  users.map((user) => {

                    const isCurrentAdmin =
                      Number(user.id) ===
                      Number(currentUserId);

                    return (

                      <tr
                        key={user.id}
                        className="
                          border-t
                          border-gray-200
                          dark:border-gray-800
                          hover:bg-gray-100
                          dark:hover:bg-gray-800/40
                        "
                      >

                        <td className="p-4">

                          <div className="font-semibold">
                            {user.name}
                          </div>

                          <div className="
                            text-xs
                            text-gray-500
                            mt-1
                          ">
                            ID: {user.id}
                          </div>

                        </td>


                        <td className="
                          p-4
                          text-gray-600
                          dark:text-gray-400
                        ">
                          {user.email}
                        </td>


                        <td className="p-4">

                          {user.role === "admin" ? (

                            <span className="
                              inline-block
                              px-3
                              py-1
                              rounded-full
                              text-sm
                              font-semibold
                              bg-red-100
                              dark:bg-red-900
                              text-red-700
                              dark:text-red-300
                            ">
                              🛡️ Admin
                            </span>

                          ) : (

                            <select
                              value={user.role}
                              onChange={(e) =>
                                changeRole(
                                  user.id,
                                  e.target.value
                                )
                              }
                              className="
                                bg-white
                                dark:bg-gray-800
                                border
                                border-gray-300
                                dark:border-gray-700
                                rounded-lg
                                px-3
                                py-2
                                text-gray-900
                                dark:text-white
                              "
                            >

                              <option value="student">
                                Student
                              </option>

                              <option value="instructor">
                                Instructor
                              </option>

                            </select>

                          )}

                        </td>


                        <td className="p-4 text-center">

                          {isCurrentAdmin ? (

                            <span className="
                              text-gray-500
                              text-sm
                            ">
                              Current account
                            </span>

                          ) : (

                            <button
                              onClick={() =>
                                deleteUser(
                                  user.id
                                )
                              }
                              className="
                                bg-red-600
                                hover:bg-red-700
                                px-4
                                py-2
                                rounded-lg
                                font-semibold
                                text-white
                                transition
                              "
                            >
                              🗑️ Delete
                            </button>

                          )}

                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* COURSE MANAGEMENT */}

      <section>

        <div className="mb-5">

          <h2 className="text-2xl font-bold">
            📚 Course Management
          </h2>

          <p className="
            text-gray-600
            dark:text-gray-400
            mt-1
          ">
            View and manage courses on the LMS.
          </p>

        </div>


        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-2xl
          overflow-hidden
          shadow-sm
          dark:shadow-none
        ">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="
                bg-gray-200
                dark:bg-gray-800
              ">

                <tr>

                  <th className="p-4 text-left">
                    Course
                  </th>

                  <th className="p-4 text-left">
                    Category
                  </th>

                  <th className="p-4 text-left">
                    Instructor
                  </th>

                  <th className="p-4 text-left">
                    Created
                  </th>

                  <th className="p-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {courses.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="
                        p-8
                        text-center
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      No courses found.
                    </td>

                  </tr>

                ) : (

                  courses.map((course) => (

                    <tr
                      key={course.id}
                      className="
                        border-t
                        border-gray-200
                        dark:border-gray-800
                        hover:bg-gray-100
                        dark:hover:bg-gray-800/40
                      "
                    >

                      <td className="p-4">

                        <div className="font-semibold">
                          {course.title}
                        </div>

                        <div className="
                          text-xs
                          text-gray-500
                          mt-1
                        ">
                          Course ID: {course.id}
                        </div>

                      </td>


                      <td className="
                        p-4
                        text-gray-600
                        dark:text-gray-400
                      ">
                        {course.category || "—"}
                      </td>


                      <td className="p-4">

                        {course.instructor_name ? (

                          <div>

                            <div className="font-semibold">
                              {course.instructor_name}
                            </div>

                            <div className="
                              text-sm
                              text-gray-500
                              dark:text-gray-400
                            ">
                              {course.instructor_email}
                            </div>

                          </div>

                        ) : (

                          <span className="text-gray-500">
                            No instructor
                          </span>

                        )}

                      </td>


                      <td className="
                        p-4
                        text-gray-600
                        dark:text-gray-400
                      ">

                        {course.created_at
                          ? new Date(
                              course.created_at
                            ).toLocaleDateString()
                          : "—"}

                      </td>


                      <td className="p-4 text-center">

                        <button
                          onClick={() =>
                            deleteCourse(
                              course.id
                            )
                          }
                          className="
                            bg-red-600
                            hover:bg-red-700
                            px-4
                            py-2
                            rounded-lg
                            font-semibold
                            text-white
                            transition
                          "
                        >
                          🗑️ Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <div className="
        mt-12
        pt-6
        border-t
        border-gray-300
        dark:border-gray-800
        text-center
        text-gray-500
        text-sm
      ">
        LMS Administration Panel
      </div>

    </div>
  );
}