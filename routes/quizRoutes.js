const express = require("express");

const router = express.Router();

const db = require("../config/db");

const authMiddleware =
  require("../middleware/authMiddleware");


// ==========================================
// CREATE QUIZ
// ==========================================

router.post(
  "/create",
  authMiddleware,
  (req, res) => {

    const {
      course_id,
      title
    } = req.body;

    if (!course_id || !title) {

      return res.status(400).json({
        message:
          "Course ID and quiz title are required"
      });

    }

    const sql = `
      INSERT INTO quizzes
      (course_id, title)
      VALUES (?, ?)
    `;

    db.query(
      sql,
      [course_id, title],
      (err, result) => {

        if (err) {

          console.error(
            "Create quiz error:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to create quiz"
          });

        }

        res.status(201).json({

          message:
            "Quiz created successfully",

          quizId:
            result.insertId

        });

      }
    );

  }
);


// ==========================================
// GET QUIZZES FOR A COURSE
// ==========================================

router.get(
  "/course/:courseId",
  authMiddleware,
  (req, res) => {

    const courseId =
      req.params.courseId;

    const sql = `
      SELECT *
      FROM quizzes
      WHERE course_id = ?
      ORDER BY id DESC
    `;

    db.query(
      sql,
      [courseId],
      (err, results) => {

        if (err) {

          console.error(
            "Get quizzes error:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to fetch quizzes"
          });

        }

        res.json(results);

      }
    );

  }
);


// ==========================================
// ADD QUESTION TO QUIZ
// ==========================================

router.post(
  "/:quizId/questions",
  authMiddleware,
  (req, res) => {

    const quizId =
      req.params.quizId;

    const {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    } = req.body;

    if (
      !question ||
      !option_a ||
      !option_b ||
      !option_c ||
      !option_d ||
      !correct_answer
    ) {

      return res.status(400).json({

        message:
          "All question fields are required"

      });

    }

    const sql = `
      INSERT INTO questions
      (
        quiz_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        quizId,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
      ],
      (err, result) => {

        if (err) {

          console.error(
            "Add question error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to add question"

          });

        }

        res.status(201).json({

          message:
            "Question added successfully",

          questionId:
            result.insertId

        });

      }
    );

  }
);


// ==========================================
// GET QUESTIONS FOR A QUIZ
// ==========================================

router.get(
  "/:quizId/questions",
  authMiddleware,
  (req, res) => {

    const quizId =
      req.params.quizId;

    const sql = `
      SELECT
        id,
        quiz_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d
      FROM questions
      WHERE quiz_id = ?
      ORDER BY id ASC
    `;

    db.query(
      sql,
      [quizId],
      (err, results) => {

        if (err) {

          console.error(
            "Get questions error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to fetch questions"

          });

        }

        res.json(results);

      }
    );

  }
);


// ==========================================
// SUBMIT QUIZ
// ==========================================

router.post(
  "/:quizId/submit",
  authMiddleware,
  (req, res) => {

    const quizId =
      req.params.quizId;

    const userId =
      req.user.id;

    const {
      answers
    } = req.body;


    // ======================================
    // VALIDATE ANSWERS
    // ======================================

    if (
      !answers ||
      !Array.isArray(answers)
    ) {

      return res.status(400).json({

        message:
          "Answers are required"

      });

    }


    // ======================================
    // GET QUESTIONS
    // ======================================

    const questionSql = `
      SELECT
        id,
        correct_answer
      FROM questions
      WHERE quiz_id = ?
      ORDER BY id ASC
    `;

    db.query(
      questionSql,
      [quizId],
      (err, questions) => {

        if (err) {

          console.error(
            "Quiz question error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to load quiz questions"

          });

        }


        if (
          questions.length === 0
        ) {

          return res.status(400).json({

            message:
              "This quiz has no questions"

          });

        }


        // ==================================
        // CALCULATE SCORE
        // ==================================

        let score = 0;


        questions.forEach(
          (question, index) => {

            const studentAnswer =
              answers[index];

            if (
              studentAnswer &&
              question.correct_answer &&
              studentAnswer
                .toString()
                .trim()
                .toUpperCase() ===
              question.correct_answer
                .toString()
                .trim()
                .toUpperCase()
            ) {

              score++;

            }

          }
        );


        const totalQuestions =
          questions.length;


        const percentage =
          Math.round(
            (score /
              totalQuestions) *
            100
          );


        const passed =
          percentage >= 70;


        // ==================================
        // SAVE RESULT
        // ==================================

        const insertSql = `
          INSERT INTO quiz_results
          (
            user_id,
            quiz_id,
            score,
            total_questions,
            percentage
          )
          VALUES (?, ?, ?, ?, ?)
        `;


        db.query(
          insertSql,
          [
            userId,
            quizId,
            score,
            totalQuestions,
            percentage
          ],
          (insertErr, result) => {

            if (insertErr) {

              console.error(
                "Save quiz result error:",
                insertErr
              );

              return res.status(500).json({

                message:
                  "Failed to save quiz result"

              });

            }


            // ==================================
            // RETURN RESULT
            // ==================================

            res.status(201).json({

              message:
                "Quiz submitted successfully",

              resultId:
                result.insertId,

              score,

              totalQuestions,

              percentage,

              passed

            });

          }
        );

      }
    );

  }
);


// ==========================================
// GET MY QUIZ RESULT
// ==========================================

router.get(
  "/:quizId/my-result",
  authMiddleware,
  (req, res) => {

    const quizId =
      req.params.quizId;

    const userId =
      req.user.id;


    const sql = `
      SELECT
        id,
        score,
        total_questions,
        percentage,
        completed_at
      FROM quiz_results
      WHERE quiz_id = ?
      AND user_id = ?
      ORDER BY id DESC
      LIMIT 1
    `;


    db.query(
      sql,
      [
        quizId,
        userId
      ],
      (err, results) => {

        if (err) {

          console.error(
            "Get quiz result error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to fetch quiz result"

          });

        }


        if (
          results.length === 0
        ) {

          return res.json({

            completed: false

          });

        }


        const result =
          results[0];


        res.json({

          completed: true,

          result,

          passed:
            Number(
              result.percentage
            ) >= 70

        });

      }
    );

  }
);


// ==========================================
// GET STUDENT QUIZ RESULTS FOR INSTRUCTOR
// ==========================================

router.get(
  "/instructor/results",
  authMiddleware,
  (req, res) => {

    const instructorId =
      req.user.id;


    const sql = `
      SELECT

        quiz_results.id
          AS result_id,

        quiz_results.score,

        quiz_results.total_questions,

        quiz_results.percentage,

        quiz_results.completed_at,


        users.id
          AS student_id,

        users.name
          AS student_name,

        users.email
          AS student_email,


        quizzes.id
          AS quiz_id,

        quizzes.title
          AS quiz_title,


        courses.id
          AS course_id,

        courses.title
          AS course_title


      FROM quiz_results


      JOIN users

      ON quiz_results.user_id =
         users.id


      JOIN quizzes

      ON quiz_results.quiz_id =
         quizzes.id


      JOIN courses

      ON quizzes.course_id =
         courses.id


      WHERE courses.instructor_id = ?


      ORDER BY
        quiz_results.completed_at DESC
    `;


    db.query(
      sql,
      [instructorId],
      (err, results) => {

        if (err) {

          console.error(
            "Instructor results error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to fetch student quiz results",

            error:
              err.message

          });

        }


        res.json(results);

      }
    );

  }
);


module.exports = router;