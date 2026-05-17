const db = require("../models/db");

/*
========================================
Log Security / User Actions
========================================
*/
const logAction = (userId, action, fileName = null) => {
  const timestamp = new Date().toISOString();

  db.run(
    `INSERT INTO logs (userId, action, fileName, timestamp)
     VALUES (?, ?, ?, ?)`,
    [userId, action, fileName, timestamp],
    (err) => {
      if (err) {
        console.error("Log insert failed:", err.message);
      }
    }
  );
};

module.exports = { logAction };