require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ...(process.env.DB_SSL_CA
    ? {
        ssl: {
          ca: process.env.DB_SSL_CA,
        },
      }
    : {}),
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Error:", err);
    return;
  }

  console.log("✅ MySQL Connected");
});

module.exports = db;