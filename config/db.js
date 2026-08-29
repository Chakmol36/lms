require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ...(process.env.DB_SSL_CA
    ? { ssl: { ca: process.env.DB_SSL_CA } }
    : {}),
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Error:", err);
  } else {
    console.log("✅ MySQL Connected");
    db.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }

  
});
  }
});

module.exports = db;
