const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// ADMIN LMS ANALYTICS
// =====================================================

router.get(
  "/admin",
  authMiddleware,
  (req, res) => {

    // Only admins
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const queries = {

      users: `
        SELECT COUNT(*) AS total
        FROM users
      `,

      students: `
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'student'
      `,

      instructors: `
        SELECT COUNT(*) AS total
        FROM users
        WHERE role = 'instructor'
      `,

      courses: `
        SELECT COUNT(*) AS total
        FROM courses
      `,

      enrollments: `
        SELECT COUNT(*) AS total
        FROM enrollments
      `,

      quizAttempts: `
        SELECT COUNT(*) AS total
        FROM quiz_results
      `,

      passedQuizzes: `
        SELECT COUNT(*) AS total
        FROM quiz_results
        WHERE percentage >= 70
      `,

      averageScore: `
        SELECT
          COALESCE(
            ROUND(AVG(percentage), 2),
            0
          ) AS average
        FROM quiz_results
      `,
    };

    const results = {};
    const entries = Object.entries(queries);
    let completed = 0;

    entries.forEach(([key, sql]) => {

      db.query(sql, (err, rows) => {

        if (err) {

          console.error(
            `Analytics ${key} error:`,
            err
          );

          return res.status(500).json({
            message: "Failed to load analytics",
          });

        }

        results[key] =
          rows[0].total ??
          rows[0].average ??
          0;

        completed++;

        if (completed === entries.length) {
          return res.json(results);
        }

      });

    });

  }
);


// =====================================================
// COURSE ANALYTICS
// =====================================================

router.get(
  "/course/:id",
  authMiddleware,
  (req, res) => {

    const courseId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // -------------------------------------------------
    // Make sure the course exists
    // -------------------------------------------------

    const courseSql = `
      SELECT
        id,
        title,
        instructor_id
      FROM courses
      WHERE id = ?
    `;

    db.query(
      courseSql,
      [courseId],
      (err, courses) => {

        if (err) {

          console.error(
            "Course analytics course lookup:",
            err
          );

          return res.status(500).json({
            message: "Failed to load analytics",
          });

        }

        if (courses.length === 0) {

          return res.status(404).json({
            message: "Course not found",
          });

        }

        const course = courses[0];

        // -------------------------------------------------
        // Only the course instructor or admin can view
        // course analytics
        // -------------------------------------------------

        if (
          userRole !== "admin" &&
          (
            userRole !== "instructor" ||
            course.instructor_id !== userId
          )
        ) {

          return res.status(403).json({
            message:
              "You are not allowed to view this course analytics",
          });

        }

        // -------------------------------------------------
        // Get quiz results for this course
        // -------------------------------------------------

        const analyticsSql = `
          SELECT
            users.name,
            users.email,
            quiz_results.score,
            quiz_results.total_questions,
            quiz_results.percentage,
            quiz_results.completed_at

          FROM quiz_results

          INNER JOIN users
            ON quiz_results.user_id = users.id

          INNER JOIN quizzes
            ON quiz_results.quiz_id = quizzes.id

          WHERE quizzes.course_id = ?

          ORDER BY quiz_results.percentage DESC
        `;

        db.query(
          analyticsSql,
          [courseId],
          (err, results) => {

            if (err) {

              console.error(
                "Course analytics query:",
                err
              );

              return res.status(500).json({
                message: "Failed to load analytics",
              });

            }

            return res.json(results);

          }
        );

      }
    );

  }
);


module.exports = router;