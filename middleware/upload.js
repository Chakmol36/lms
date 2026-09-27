const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// Keep upload storage beside server.js, regardless of the process working directory.
const uploadsDirectory = path.join(__dirname, "..", "uploads");
const imagesDirectory = path.join(uploadsDirectory, "images");
const videosDirectory = path.join(uploadsDirectory, "videos");

// Create the directories before Multer handles any upload requests.
fs.mkdirSync(imagesDirectory, { recursive: true });
fs.mkdirSync(videosDirectory, { recursive: true });

/* =========================
   IMAGE SETTINGS
========================= */

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDirectory);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const filename =
      `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

    cb(null, filename);
  },
});

/* =========================
   VIDEO SETTINGS
========================= */

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videosDirectory);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const filename =
      `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

    cb(null, filename);
  },
});

/* =========================
   IMAGE FILTER
========================= */

const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(extension)
  ) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Invalid image file. Only JPG, JPEG, PNG and WEBP files are allowed."
    )
  );
};

/* =========================
   VIDEO FILTER
========================= */

const videoFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  const allowedExtensions = [
    ".mp4",
    ".webm",
    ".mov",
  ];

  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(extension)
  ) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Invalid video file. Only MP4, WEBM and MOV files are allowed."
    )
  );
};

/* =========================
   IMAGE UPLOAD
========================= */

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

/* =========================
   VIDEO UPLOAD
========================= */

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
  },
});

/* =========================
   EXPORT
========================= */

module.exports = {
  uploadImage,
  uploadVideo,
};