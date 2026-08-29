const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");


// ========================================
// GET USER PROFILE
// ========================================

router.get(
  "/profile",
  authMiddleware,
  (req, res) => {

    res.json({
      message: "Welcome to your profile 🔥",
      user: req.user,
    });

  }
);


// ========================================
// GET MY COURSES
// ========================================

router.get(
  "/my-courses",
  authMiddleware,
  (req, res) => {

    const user_id = req.user.id;

    const sql = `
      SELECT
        courses.id,
        courses.title,
        courses.description,
        users.name AS instructor
      FROM enrollments
      JOIN courses
        ON enrollments.course_id = courses.id
      JOIN users
        ON courses.instructor_id = users.id
      WHERE enrollments.user_id = ?
    `;

    db.query(
      sql,
      [user_id],
      (err, results) => {

        if (err) {
          console.error("Get my courses error:", err);

          return res.status(500).json({
            message: "Internal server error",
          });
        }

        res.json(results);

      }
    );

  }
);


module.exports = router;