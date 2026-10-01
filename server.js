const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cors = require("cors"); // 1. Moved to the top with other imports
require("dotenv").config();

// Database
require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();


// ========================================
// PROXY SETUP (CRITICAL FOR RENDER)
// ========================================
// 2. Tells express-rate-limit to trust Render's load balancer IP
app.set("trust proxy", 1);


// ========================================
// SECURITY
// ========================================

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);


// ========================================
// CORS
// ========================================
// 3. Simplified robust CORS config that won't throw 500 errors
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://lms-geo6.onrender.com"
    ],
    credentials: true,
  })
);


// ========================================
// BODY PARSING
// ========================================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);


// ========================================
// RATE LIMITING
// ========================================

// General API protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);


// Stricter protection for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many login or registration attempts. Please try again later.",
  },
});

app.use("/api/auth", authLimiter);


// ========================================
// UPLOADS
// ========================================

// Serve uploaded images/videos
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    fallthrough: false,
  })
);


// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/certificates", certificateRoutes);


// ========================================
// HOME / HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "LMS API running",
    status: "OK",
  });
});


// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});


// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  // Multer errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      message: "File upload error",
    });
  }

  // Custom upload/filter errors
  if (err.message && err.message.startsWith("Invalid image file")) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.message && err.message.startsWith("Invalid video file")) {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Don't expose internal error details
  return res.status(500).json({
    message: "Internal server error",
  });
});


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});