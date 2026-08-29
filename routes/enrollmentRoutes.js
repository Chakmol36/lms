const express = require("express");
const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const db = require("../config/db");


// ========================================
// ENROLL IN COURSE
// ========================================

router.post(
  "/enroll/:id",
  authMiddleware,
  (req, res) => {

    const course_id = req.params.id;
    const user_id = req.user.id;


    // ========================================
    // CHECK IF COURSE EXISTS
    // ========================================

    const courseSql = `
      SELECT id, title
      FROM courses
      WHERE id = ?
      LIMIT 1
    `;

    db.query(
      courseSql,
      [course_id],
      (courseErr, courseResults) => {

        if (courseErr) {

          console.error(
            "Course check error:",
            courseErr
          );

          return res.status(500).json({
            message:
              "Failed to check course",
          });

        }


        // ========================================
        // COURSE NOT FOUND
        // ========================================

        if (courseResults.length === 0) {

          return res.status(404).json({
            message:
              "Course not found",
          });

        }


        // ========================================
        // CHECK EXISTING ENROLLMENT
        // ========================================

        const checkSql = `
          SELECT id
          FROM enrollments
          WHERE user_id = ?
          AND course_id = ?
          LIMIT 1
        `;

        db.query(
          checkSql,
          [user_id, course_id],
          (checkErr, existingEnrollment) => {

            if (checkErr) {

              console.error(
                "Enrollment check error:",
                checkErr
              );

              return res.status(500).json({
                message:
                  "Failed to check enrollment",
              });

            }


            // ========================================
            // ALREADY ENROLLED
            // ========================================

            if (
              existingEnrollment.length > 0
            ) {

              return res.status(409).json({

                message:
                  "You are already enrolled in this course.",

                alreadyEnrolled:
                  true,

                courseId:
                  Number(course_id),

              });

            }


            // ========================================
            // CREATE ENROLLMENT
            // ========================================

            const insertSql = `
              INSERT INTO enrollments
              (
                user_id,
                course_id
              )
              VALUES (?, ?)
            `;

            db.query(
              insertSql,
              [user_id, course_id],
              (insertErr, result) => {

                if (insertErr) {

                  console.error(
                    "Enrollment insert error:",
                    insertErr
                  );


                  // ========================================
                  // DUPLICATE KEY PROTECTION
                  // ========================================

                  if (
                    insertErr.code ===
                    "ER_DUP_ENTRY"
                  ) {

                    return res.status(409).json({

                      message:
                        "You are already enrolled in this course.",

                      alreadyEnrolled:
                        true,

                      courseId:
                        Number(course_id),

                    });

                  }


                  return res.status(500).json({

                    message:
                      "Failed to enroll in course",

                  });

                }


                // ========================================
                // SUCCESS
                // ========================================

                return res.status(201).json({

                  message:
                    "Enrollment successful 🎉",

                  enrollmentId:
                    result.insertId,

                  courseId:
                    Number(course_id),

                  alreadyEnrolled:
                    false,

                });

              }
            );

          }
        );

      }
    );

  }
);


// ========================================
// GET MY ENROLLED COURSES
// ========================================

router.get(
  "/my-courses",
  authMiddleware,
  (req, res) => {

    const user_id = req.user.id;


    const sql = `
      SELECT
        courses.*
      FROM enrollments

      JOIN courses
        ON enrollments.course_id =
           courses.id

      WHERE enrollments.user_id = ?

      ORDER BY enrollments.id DESC
    `;


    db.query(
      sql,
      [user_id],
      (err, results) => {

        if (err) {

          console.error(
            "Get enrolled courses error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to fetch enrolled courses",

          });

        }


        return res.json(results);

      }
    );

  }
);


// ========================================
// CHECK IF STUDENT IS ENROLLED
// ========================================

router.get(
  "/check/:courseId",
  authMiddleware,
  (req, res) => {

    const user_id =
      req.user.id;

    const course_id =
      req.params.courseId;


    const sql = `
      SELECT id
      FROM enrollments
      WHERE user_id = ?
      AND course_id = ?
      LIMIT 1
    `;


    db.query(
      sql,
      [
        user_id,
        course_id
      ],
      (err, results) => {

        if (err) {

          console.error(
            "Enrollment check error:",
            err
          );

          return res.status(500).json({

            message:
              "Failed to check enrollment",

          });

        }


        return res.json({

          enrolled:
            results.length > 0,

          courseId:
            Number(course_id),

        });

      }
    );

  }
);


module.exports = router;