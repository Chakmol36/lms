const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// GET ALL USERS
// =====================================================

router.get(
  "/users",
  authMiddleware,
  (req, res) => {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const sql = `
      SELECT
        id,
        name,
        email,
        role
      FROM users
      ORDER BY id ASC
    `;

    db.query(
      sql,
      (err, results) => {

        if (err) {

          console.error(
            "Admin users error:",
            err
          );

          return res.status(500).json({
            message: "Failed to load users",
          });

        }

        res.json(results);

      }
    );

  }
);


// =====================================================
// GET ALL COURSES
// =====================================================

router.get(
  "/courses",
  authMiddleware,
  (req, res) => {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const sql = `
      SELECT
        courses.id,
        courses.title,
        courses.description,
        courses.category,
        courses.image,
        courses.instructor_id,
        courses.created_at,

        users.name AS instructor_name,
        users.email AS instructor_email

      FROM courses

      LEFT JOIN users
        ON courses.instructor_id = users.id

      ORDER BY courses.created_at DESC
    `;

    db.query(
      sql,
      (err, results) => {

        if (err) {

          console.error(
            "Admin courses error:",
            err
          );

          return res.status(500).json({
            message: "Failed to load courses",
          });

        }

        res.json(results);

      }
    );

  }
);


// =====================================================
// DELETE USER
// =====================================================

router.delete(
  "/users/:id",
  authMiddleware,
  (req, res) => {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const userId = req.params.id;

    // Prevent an admin from deleting themselves

    if (
      Number(userId) ===
      Number(req.user.id)
    ) {

      return res.status(400).json({
        message:
          "You cannot delete your own admin account.",
      });

    }

    const sql =
      "DELETE FROM users WHERE id = ?";

    db.query(
      sql,
      [userId],
      (err, result) => {

        if (err) {

          console.error(
            "Delete user error:",
            err
          );

          return res.status(500).json({
            message: "Failed to delete user",
          });

        }

        if (result.affectedRows === 0) {

          return res.status(404).json({
            message: "User not found",
          });

        }

        res.json({
          message: "User deleted successfully",
        });

      }
    );

  }
);


// =====================================================
// DELETE COURSE
// =====================================================

router.delete(
  "/courses/:id",
  authMiddleware,
  (req, res) => {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const courseId = req.params.id;

    const sql =
      "DELETE FROM courses WHERE id = ?";

    db.query(
      sql,
      [courseId],
      (err, result) => {

        if (err) {

          console.error(
            "Delete course error:",
            err
          );

          return res.status(500).json({
            message: "Failed to delete course",
          });

        }

        if (result.affectedRows === 0) {

          return res.status(404).json({
            message: "Course not found",
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


// =====================================================
// CHANGE USER ROLE
// =====================================================

router.put(
  "/users/:id/role",
  authMiddleware,
  (req, res) => {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const userId = req.params.id;
    const { role } = req.body;

    // Only these roles are allowed

    const allowedRoles = [
      "student",
      "instructor",
      "admin",
    ];

    if (!allowedRoles.includes(role)) {

      return res.status(400).json({
        message: "Invalid role",
      });

    }

    // Prevent changing your own admin role

    if (
      Number(userId) ===
      Number(req.user.id)
    ) {

      return res.status(400).json({
        message:
          "You cannot change your own role.",
      });

    }

    const sql = `
      UPDATE users
      SET role = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [role, userId],
      (err, result) => {

        if (err) {

          console.error(
            "Role update error:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to update user role",
          });

        }

        if (result.affectedRows === 0) {

          return res.status(404).json({
            message: "User not found",
          });

        }

        res.json({
          message:
            "User role updated successfully",
        });

      }
    );

  }
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;