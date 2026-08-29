const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const instructorMiddleware = require("../middleware/instructorMiddleware");

const {
  uploadImage,
  uploadVideo,
} = require("../middleware/upload");


// ========================================
// CREATE COURSE
// ========================================

router.post(
  "/create",
  authMiddleware,
  instructorMiddleware,
  uploadImage.single("image"),
  (req, res) => {

    const {
      title,
      description,
      category,
    } = req.body;

    const instructor_id = req.user.id;

    const image = req.file
      ? `/uploads/images/${req.file.filename}`
      : null;

    const sql = `
      INSERT INTO courses
      (title, description, category, image, instructor_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        title,
        description,
        category,
        image,
        instructor_id,
      ],
      (err, result) => {

        if (err) {
          console.error("Create course error:", err);

          return res.status(500).json({
            message: "Internal server error",
          });
        }

        res.status(201).json({
          message: "Course created successfully",
        });

      }
    );

  }
);


// ========================================
// GET ALL COURSES
// ========================================

router.get("/", (req, res) => {

  const sql = `
    SELECT * FROM courses
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.error("Get courses error:", err);

      return res.status(500).json({
        message: "Internal server error",
      });
    }

    res.json(results);

  });

});


// ========================================
// GET SINGLE COURSE
// ========================================

router.get("/:id", (req, res) => {

  const sql =
    "SELECT * FROM courses WHERE id = ?";

  db.query(
    sql,
    [req.params.id],
    (err, results) => {

      if (err) {
        console.error("Get course error:", err);

        return res.status(500).json({
          message: "Internal server error",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      res.json(results[0]);

    }
  );

});


// ========================================
// DELETE COURSE
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  (req, res) => {

    const courseId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;


    // Students cannot delete courses

    if (userRole === "student") {
      return res.status(403).json({
        message:
          "Students are not allowed to delete courses",
      });
    }


    // Check course ownership

    const checkSql = `
      SELECT instructor_id
      FROM courses
      WHERE id = ?
    `;

    db.query(
      checkSql,
      [courseId],
      (err, results) => {

        if (err) {
          console.error("Course ownership check error:", err);

          return res.status(500).json({
            message: "Internal server error",
          });
        }


        if (results.length === 0) {
          return res.status(404).json({
            message: "Course not found",
          });
        }


        const course = results[0];


        // Instructors can only delete
        // their own courses

        if (
          userRole === "instructor" &&
          course.instructor_id !== userId
        ) {

          return res.status(403).json({
            message:
              "You can only delete your own courses",
          });

        }


        // Delete course

        const deleteSql = `
          DELETE FROM courses
          WHERE id = ?
        `;

        db.query(
          deleteSql,
          [courseId],
          (err, result) => {

            if (err) {
              console.error("Delete course error:", err);

              return res.status(500).json({
                message:
                  "Failed to delete course",
              });
            }


            res.json({
              message:
                "Course deleted successfully",
            });

          }
        );

      }
    );

  }
);


// ========================================
// ENROLL COURSE
// ========================================

router.post(
  "/:id/enroll",
  authMiddleware,
  (req, res) => {

    const user_id = req.user.id;
    const course_id = req.params.id;

    const sql = `
      INSERT INTO enrollments
      (user_id, course_id)
      VALUES (?, ?)
    `;

    db.query(
      sql,
      [user_id, course_id],
      (err, result) => {

        if (err) {
          console.error("Course enrollment error:", err);

          return res.status(500).json({
            message: "Internal server error",
          });
        }

        res.json({
          message:
            "Enrollment successful 🎉",
        });

      }
    );

  }
);


// ========================================
// ADD LESSON
// ========================================

router.post(
  "/:id/lessons",
  authMiddleware,
  instructorMiddleware,
  uploadVideo.single("video"),
  (req, res) => {

    const courseId = req.params.id;
    const instructorId = req.user.id;

    const {
      title,
    } = req.body;


    // Check course ownership

    const checkSql = `
      SELECT instructor_id
      FROM courses
      WHERE id = ?
    `;

    db.query(
      checkSql,
      [courseId],
      (err, results) => {

        if (err) {
          console.error("Lesson ownership check error:", err);

          return res.status(500).json({
            message: "Internal server error",
          });
        }


        if (results.length === 0) {
          return res.status(404).json({
            message: "Course not found",
          });
        }


        // Ownership check

        if (
          results[0].instructor_id !== instructorId
        ) {

          return res.status(403).json({
            message:
              "You can only add lessons to your own courses",
          });

        }


        const video = req.file
          ? `/uploads/videos/${req.file.filename}`
          : null;


        const sql = `
          INSERT INTO lessons
          (course_id, title, video)
          VALUES (?, ?, ?)
        `;

        db.query(
          sql,
          [
            courseId,
            title,
            video,
          ],
          (err, result) => {

            if (err) {
              console.error("Add lesson error:", err);

              return res.status(500).json({
                message:
                  "Failed to add lesson",
              });
            }

            res.json({
              message:
                "Lesson added successfully",
            });

          }
        );

      }
    );

  }
);


// ========================================
// GET COURSE LESSONS
// ========================================

router.get(
  "/:id/lessons",
  (req, res) => {

    const sql =
      "SELECT * FROM lessons WHERE course_id = ?";

    db.query(
      sql,
      [req.params.id],
      (err, results) => {

        if (err) {
          console.error("Get lessons error:", err);

          return res.status(500).json({
            message: "Internal server error",
          });
        }

        res.json(results);

      }
    );

  }
);


// ========================================
// UPDATE COURSE
// ========================================

router.put(
  "/:id",
  authMiddleware,
  instructorMiddleware,
  (req, res) => {

    const courseId = req.params.id;
    const instructorId = req.user.id;

    const {
      title,
      description,
    } = req.body;


    // Check that the course exists
    // and belongs to this instructor

    const checkSql = `
      SELECT instructor_id
      FROM courses
      WHERE id = ?
    `;

    db.query(
      checkSql,
      [courseId],
      (err, results) => {

        if (err) {
          console.error("Course ownership check error:", err);

          return res.status(500).json({
            message: "Internal server error",
          });
        }


        if (results.length === 0) {
          return res.status(404).json({
            message: "Course not found",
          });
        }


        // Ownership check

        if (
          results[0].instructor_id !== instructorId
        ) {

          return res.status(403).json({
            message:
              "You can only update your own courses",
          });

        }


        // Update course

        const updateSql = `
          UPDATE courses
          SET title = ?, description = ?
          WHERE id = ?
        `;

        db.query(
          updateSql,
          [
            title,
            description,
            courseId,
          ],
          (err, result) => {

            if (err) {
              console.error("Update course error:", err);

              return res.status(500).json({
                message:
                  "Failed to update course",
              });
            }

            res.json({
              message:
                "Course updated successfully",
            });

          }
        );

      }
    );

  }
);


module.exports = router;