const express = require("express");

const router = express.Router();

const db = require("../config/db");

const authMiddleware =
  require("../middleware/authMiddleware");


// ========================================
// MARK LESSON AS COMPLETE
// ========================================

router.post(
  "/",
  authMiddleware,
  (req, res) => {

    const {
      lesson_id
    } = req.body;

    const user_id =
      req.user.id;


    if (!lesson_id) {

      return res.status(400).json({

        message:
          "Lesson ID is required"

      });

    }


    const sql = `
      INSERT INTO progress
      (user_id, lesson_id, completed)

      VALUES (?, ?, true)

      ON DUPLICATE KEY UPDATE
      completed = true,
      completed_at = CURRENT_TIMESTAMP
    `;


    db.query(

      sql,

      [
        user_id,
        lesson_id
      ],

      (err, result) => {

        if (err) {

          console.error(
            "Progress Error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to save progress",

            error:
              err.message

          });

        }


        res.json({

          message:
            "Lesson completed successfully",

          lesson_id

        });

      }

    );

  }
);


// ========================================
// GET STUDENT PROGRESS FOR A COURSE
// ========================================

router.get(
  "/:courseId",
  authMiddleware,
  (req, res) => {

    const user_id =
      req.user.id;

    const courseId =
      req.params.courseId;


    const sql = `
      SELECT
        progress.lesson_id,
        progress.completed,
        progress.completed_at

      FROM progress

      JOIN lessons

      ON progress.lesson_id =
         lessons.id

      WHERE progress.user_id = ?

      AND lessons.course_id = ?

      AND progress.completed = true
    `;


    db.query(

      sql,

      [
        user_id,
        courseId
      ],

      (err, results) => {

        if (err) {

          console.error(
            "Fetch Progress Error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to fetch progress",

            error:
              err.message

          });

        }


        res.json(results);

      }

    );

  }
);


// ========================================
// CHECK COURSE COMPLETION
// ========================================
//
// Checks:
// 1. All lessons completed
// 2. Quiz passed with 70% or higher
//
// ========================================

router.get(
  "/:courseId/completion",
  authMiddleware,
  (req, res) => {

    const user_id =
      req.user.id;

    const courseId =
      req.params.courseId;


    // ====================================
    // STEP 1
    // GET TOTAL LESSONS
    // ====================================

    const totalLessonsSQL = `

      SELECT
        COUNT(*) AS total_lessons

      FROM lessons

      WHERE course_id = ?

    `;


    db.query(

      totalLessonsSQL,

      [courseId],

      (err, lessonCountResult) => {

        if (err) {

          console.error(
            "Total Lessons Error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to check course completion",

            error:
              err.message

          });

        }


        const totalLessons =
          lessonCountResult[0]
            .total_lessons;


        // ==================================
        // STEP 2
        // COUNT COMPLETED LESSONS
        // ==================================

        const completedLessonsSQL = `

          SELECT
            COUNT(*) AS completed_lessons

          FROM progress

          JOIN lessons

          ON progress.lesson_id =
             lessons.id

          WHERE progress.user_id = ?

          AND lessons.course_id = ?

          AND progress.completed = true

        `;


        db.query(

          completedLessonsSQL,

          [
            user_id,
            courseId
          ],

          (err, completedResult) => {

            if (err) {

              console.error(
                "Completed Lessons Error:",
                err
              );

              return res.status(500).json({

                message:
                  "Failed to check completed lessons",

                error:
                  err.message

              });

            }


            const completedLessons =
              completedResult[0]
                .completed_lessons;


            // ==================================
            // CHECK LESSON COMPLETION
            // ==================================

            const lessonsCompleted =
              Number(totalLessons) > 0 &&
              Number(completedLessons) >=
              Number(totalLessons);


            // ==================================
            // STEP 3
            // GET QUIZ RESULT
            // ==================================

            const quizSQL = `

              SELECT

                quiz_results.id,

                quiz_results.quiz_id,

                quiz_results.score,

                quiz_results.total_questions,

                quiz_results.percentage,

                quiz_results.completed_at

              FROM quiz_results

              JOIN quizzes

              ON quiz_results.quiz_id =
                 quizzes.id

              WHERE quiz_results.user_id = ?

              AND quizzes.course_id = ?

              ORDER BY
                quiz_results.percentage DESC,

                quiz_results.completed_at DESC

              LIMIT 1

            `;


            db.query(

              quizSQL,

              [
                user_id,
                courseId
              ],

              (err, quizResult) => {

                if (err) {

                  console.error(
                    "Quiz Result Error:",
                    err
                  );

                  return res.status(500).json({

                    message:
                      "Failed to check quiz result",

                    error:
                      err.message

                  });

                }


                // ==================================
                // NO QUIZ RESULT
                // ==================================

                if (
                  quizResult.length === 0
                ) {

                  return res.json({

                    eligible: false,

                    lessonsCompleted:
                      lessonsCompleted,

                    quizPassed:
                      false,

                    totalLessons:
                      totalLessons,

                    completedLessons:
                      completedLessons,

                    quizResult:
                      null

                  });

                }


                // ==================================
                // CHECK QUIZ PASS
                // ==================================

                const latestQuiz =
                  quizResult[0];


                const quizPassed =
                  Number(
                    latestQuiz.percentage
                  ) >= 70;


                // ==================================
                // FINAL ELIGIBILITY
                // ==================================

                const eligible =
                  lessonsCompleted &&
                  quizPassed;


                // ==================================
                // RESPONSE
                // ==================================

                res.json({

                  eligible,

                  lessonsCompleted,

                  quizPassed,

                  totalLessons,

                  completedLessons,

                  quizResult: {

                    id:
                      latestQuiz.id,

                    quiz_id:
                      latestQuiz.quiz_id,

                    score:
                      latestQuiz.score,

                    total_questions:
                      latestQuiz.total_questions,

                    percentage:
                      latestQuiz.percentage,

                    completed_at:
                      latestQuiz.completed_at

                  }

                });

              }

            );

          }

        );

      }

    );

  }
);


module.exports = router;