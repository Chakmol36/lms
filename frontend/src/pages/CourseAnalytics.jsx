import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import API from "../services/api";


export default function CourseAnalytics() {

  const { id } = useParams();


  const [
    students,
    setStudents
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  // ========================================
  // FETCH ANALYTICS
  // ========================================

  useEffect(() => {

    fetchAnalytics();

  }, [id]);


  const fetchAnalytics = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");


      const res =
        await API.get(
          `/analytics/course/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      setStudents(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.log(err);

      alert(
        "Failed to load analytics"
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // STATISTICS
  // ========================================

  const average =
    students.length > 0
      ? (
          students.reduce(
            (sum, s) =>
              sum + Number(s.percentage),
            0
          ) / students.length
        ).toFixed(1)
      : 0;


  const pass =
    students.filter(
      s =>
        Number(s.percentage) >= 70
    ).length;


  const fail =
    students.length - pass;


  const passRate =
    students.length > 0
      ? Math.round(
          (pass / students.length) * 100
        )
      : 0;


  // ========================================
  // LEADERBOARD
  // ========================================

  const leaderboard =
    [...students].sort(
      (a, b) =>
        Number(b.percentage) -
        Number(a.percentage)
    );


  const topStudent =
    leaderboard.length > 0
      ? leaderboard[0]
      : null;


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
      p-6
      md:p-10
      transition-colors
      duration-300
    ">

      <div className="
        max-w-7xl
        mx-auto
      ">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <h1 className="
          text-4xl
          font-bold
          mb-10
        ">

          📊 Course Analytics

        </h1>


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading && (

          <div className="
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            rounded-2xl
            p-10
            text-center
          ">

            <h2 className="
              text-lg
              text-gray-600
              dark:text-gray-400
            ">

              Loading...

            </h2>

          </div>

        )}


        {!loading && (

          <>


            {/* ================================= */}
            {/* STAT CARDS */}
            {/* ================================= */}

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-4
              gap-6
              mb-10
            ">


              {/* STUDENTS */}

              <div className="
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                p-6
                rounded-2xl
                shadow-sm
                dark:shadow-none
              ">

                <h2 className="
                  text-gray-500
                  dark:text-gray-400
                ">

                  Students

                </h2>


                <p className="
                  text-4xl
                  font-bold
                ">

                  {students.length}

                </p>

              </div>


              {/* AVERAGE */}

              <div className="
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                p-6
                rounded-2xl
                shadow-sm
                dark:shadow-none
              ">

                <h2 className="
                  text-gray-500
                  dark:text-gray-400
                ">

                  Average

                </h2>


                <p className="
                  text-4xl
                  font-bold
                  text-blue-500
                  dark:text-blue-400
                ">

                  {average}%

                </p>

              </div>


              {/* PASSED */}

              <div className="
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                p-6
                rounded-2xl
                shadow-sm
                dark:shadow-none
              ">

                <h2 className="
                  text-gray-500
                  dark:text-gray-400
                ">

                  Passed

                </h2>


                <p className="
                  text-4xl
                  font-bold
                  text-green-600
                  dark:text-green-400
                ">

                  {pass}

                </p>

              </div>


              {/* FAILED */}

              <div className="
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                p-6
                rounded-2xl
                shadow-sm
                dark:shadow-none
              ">

                <h2 className="
                  text-gray-500
                  dark:text-gray-400
                ">

                  Failed

                </h2>


                <p className="
                  text-4xl
                  font-bold
                  text-red-600
                  dark:text-red-400
                ">

                  {fail}

                </p>

              </div>

            </div>


            {/* ================================= */}
            {/* TOP PERFORMER + PASS RATE */}
            {/* ================================= */}

            <div className="
              grid
              lg:grid-cols-2
              gap-8
              mb-10
            ">


              {/* TOP STUDENT */}

              <div className="
                bg-gradient-to-r
                from-yellow-500
                to-orange-600
                text-white
                rounded-2xl
                p-8
              ">

                <h2 className="
                  text-2xl
                  font-bold
                  mb-4
                ">

                  🏆 Top Performer

                </h2>


                {topStudent ? (

                  <>

                    <h3 className="
                      text-3xl
                      font-bold
                    ">

                      {topStudent.name}

                    </h3>


                    <p className="
                      text-lg
                      opacity-90
                    ">

                      {topStudent.email}

                    </p>


                    <div className="
                      mt-6
                      text-5xl
                      font-bold
                    ">

                      {topStudent.percentage}%

                    </div>


                    <p className="
                      mt-2
                    ">

                      {topStudent.score}/
                      {topStudent.total_questions}

                    </p>

                  </>

                ) : (

                  <p>

                    No quiz attempts yet.

                  </p>

                )}

              </div>


              {/* PASS RATE */}

              <div className="
                bg-white
                dark:bg-gray-900
                border
                border-gray-200
                dark:border-gray-800
                rounded-2xl
                p-8
                shadow-sm
                dark:shadow-none
              ">

                <h2 className="
                  text-2xl
                  font-bold
                  mb-6
                ">

                  📈 Pass Rate

                </h2>


                <div className="
                  w-full
                  h-6
                  bg-gray-200
                  dark:bg-gray-700
                  rounded-full
                  overflow-hidden
                ">

                  <div
                    className="
                      bg-green-500
                      h-full
                      transition-all
                      duration-700
                    "
                    style={{
                      width:
                        `${passRate}%`
                    }}
                  />

                </div>


                <div className="
                  flex
                  justify-between
                  mt-4
                  text-lg
                ">

                  <span>

                    Passed: {pass}

                  </span>


                  <span>

                    {passRate}%

                  </span>

                </div>

              </div>

            </div>


            {/* ================================= */}
            {/* STUDENT TABLE */}
            {/* ================================= */}

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

              <div className="
                overflow-x-auto
              ">

                <table className="
                  w-full
                  min-w-[700px]
                ">

                  <thead className="
                    bg-gray-100
                    dark:bg-gray-800
                  ">

                    <tr>

                      <th className="
                        p-4
                        text-left
                      ">

                        Student

                      </th>


                      <th className="
                        p-4
                      ">

                        Score

                      </th>


                      <th className="
                        p-4
                      ">

                        %

                      </th>


                      <th className="
                        p-4
                      ">

                        Status

                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {students.length === 0 ? (

                      <tr>

                        <td
                          colSpan="4"
                          className="
                            p-10
                            text-center
                            text-gray-500
                            dark:text-gray-400
                          "
                        >

                          No quiz attempts yet.

                        </td>

                      </tr>

                    ) : (

                      students.map(
                        (student) => (

                          <tr
                            key={student.email}
                            className="
                              border-t
                              border-gray-200
                              dark:border-gray-800
                            "
                          >

                            <td className="
                              p-4
                            ">

                              <div className="
                                font-bold
                              ">

                                {student.name}

                              </div>


                              <div className="
                                text-sm
                                text-gray-500
                                dark:text-gray-400
                              ">

                                {student.email}

                              </div>

                            </td>


                            <td className="
                              text-center
                            ">

                              {student.score}/
                              {student.total_questions}

                            </td>


                            <td className="
                              text-center
                              font-semibold
                            ">

                              {student.percentage}%

                            </td>


                            <td className="
                              text-center
                            ">

                              {Number(
                                student.percentage
                              ) >= 70 ? (

                                <span className="
                                  text-green-600
                                  dark:text-green-400
                                  font-semibold
                                ">

                                  ✅ Passed

                                </span>

                              ) : (

                                <span className="
                                  text-red-600
                                  dark:text-red-400
                                  font-semibold
                                ">

                                  ❌ Failed

                                </span>

                              )}

                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </>

        )}

      </div>

    </div>

  );

}