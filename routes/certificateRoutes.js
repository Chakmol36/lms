const express = require("express");

const router = express.Router();

const db = require("../config/db");

const authMiddleware =
  require("../middleware/authMiddleware");


// ========================================
// GET CERTIFICATE
// ========================================

router.get(
  "/:courseId",
  authMiddleware,
  (req, res) => {

    const userId =
      req.user.id;

    const courseId =
      req.params.courseId;


    // ========================================
    // GET STUDENT + COURSE
    // ========================================

    const courseSql = `
      SELECT
        users.id AS user_id,
        users.name AS student_name,

        courses.id AS course_id,
        courses.title AS course_title

      FROM users

      JOIN enrollments
      ON users.id = enrollments.user_id

      JOIN courses
      ON enrollments.course_id = courses.id

      WHERE users.id = ?
      AND courses.id = ?
    `;


    db.query(
      courseSql,
      [
        userId,
        courseId
      ],
      (err, results) => {

        if (err) {

          console.error(
            "Certificate course error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to get certificate information"

          });

        }


        // ========================================
        // CHECK ENROLLMENT
        // ========================================

        if (
          results.length === 0
        ) {

          return res.status(403).json({

            message:
              "You are not enrolled in this course"

          });

        }


        const course =
          results[0];


        // ========================================
        // CHECK LESSON PROGRESS
        // ========================================

        const progressSql = `

          SELECT

            COUNT(
              lessons.id
            ) AS total_lessons,


            COUNT(
              CASE
                WHEN progress.completed = true
                THEN 1
              END
            ) AS completed_lessons


          FROM lessons


          LEFT JOIN progress

          ON lessons.id =
             progress.lesson_id

          AND progress.user_id = ?


          WHERE lessons.course_id = ?

        `;


        db.query(
          progressSql,
          [
            userId,
            courseId
          ],
          (err, progressResults) => {

            if (err) {

              console.error(
                "Certificate progress error:",
                err
              );

              return res.status(500).json({

                message:
                  "Failed to check course progress"

              });

            }


            const progress =
              progressResults[0];


            const totalLessons =
              Number(
                progress.total_lessons
              );


            const completedLessons =
              Number(
                progress.completed_lessons
              );


            // ========================================
            // CHECK LESSON COMPLETION
            // ========================================

            if (
              totalLessons === 0
            ) {

              return res.status(403).json({

                message:
                  "This course has no lessons",

                totalLessons,

                completedLessons,

                lessonsCompleted: false,

                quizPassed: false

              });

            }


            if (
              completedLessons <
              totalLessons
            ) {

              return res.status(403).json({

                message:
                  "You must complete all lessons before receiving a certificate",

                totalLessons,

                completedLessons,

                lessonsCompleted: false,

                quizPassed: false

              });

            }


            // ========================================
            // CHECK COURSE QUIZZES
            // ========================================

            const quizSql = `

              SELECT
                quizzes.id,
                quizzes.title

              FROM quizzes

              WHERE quizzes.course_id = ?

            `;


            db.query(
              quizSql,
              [courseId],
              (err, quizzes) => {

                if (err) {

                  console.error(
                    "Certificate quiz error:",
                    err
                  );

                  return res.status(500).json({

                    message:
                      "Failed to check course quizzes"

                  });

                }


                // ========================================
                // COURSE MUST HAVE A QUIZ
                // ========================================

                if (
                  quizzes.length === 0
                ) {

                  return res.status(403).json({

                    message:
                      "You must complete and pass the course quiz before receiving a certificate",

                    totalLessons,

                    completedLessons,

                    lessonsCompleted: true,

                    quizRequired: true,

                    quizPassed: false

                  });

                }


                const quizIds =
                  quizzes.map(
                    quiz => quiz.id
                  );


                // ========================================
                // CHECK PASSED QUIZ
                // ========================================

                const placeholders =
                  quizIds
                    .map(() => "?")
                    .join(",");


                const resultSql = `

                  SELECT
                    MAX(percentage)
                      AS highest_percentage

                  FROM quiz_results

                  WHERE user_id = ?

                  AND quiz_id IN
                    (${placeholders})

                  AND percentage >= 70

                `;


                db.query(
                  resultSql,
                  [
                    userId,
                    ...quizIds
                  ],
                  (err, quizResults) => {

                    if (err) {

                      console.error(
                        "Certificate quiz result error:",
                        err
                      );

                      return res.status(500).json({

                        message:
                          "Failed to check quiz results"

                      });

                    }


                    const highestPercentage =
                      quizResults[0]
                        ?.highest_percentage;


                    const quizPassed =
                      highestPercentage !== null &&
                      highestPercentage !== undefined;


                    // ========================================
                    // QUIZ NOT PASSED
                    // ========================================

                    if (!quizPassed) {

                      return res.status(403).json({

                        message:
                          "You must pass the course quiz with at least 70% before receiving a certificate",

                        totalLessons,

                        completedLessons,

                        lessonsCompleted: true,

                        quizRequired: true,

                        quizPassed: false,

                        quizPercentage: null

                      });

                    }


                    // ========================================
                    // CERTIFICATE ELIGIBLE
                    // ========================================

                    const certificateId =
                      `CERT-${courseId}-${userId}`;


                    const completionDate =
                      new Date()
                        .toISOString()
                        .split("T")[0];


                    // ========================================
                    // SEND CERTIFICATE
                    // ========================================

                    return res.json({

                      certificateId,

                      studentName:
                        course.student_name,

                      courseTitle:
                        course.course_title,

                      completionDate,

                      totalLessons,

                      completedLessons,

                      lessonsCompleted: true,

                      quizPassed: true,

                      quizPercentage:
                        Number(
                          highestPercentage
                        )

                    });

                  }
                );

              }
            );

          }
        );

      }
    );

  }
);


module.exports = router;