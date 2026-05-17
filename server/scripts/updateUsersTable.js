const db = require("../models/db");

/*
========================================
ADD FORGOT PASSWORD COLUMNS
========================================
*/

db.serialize(() => {
  db.run(`ALTER TABLE users ADD COLUMN resetToken TEXT`, (err) => {
    if (err) {
      console.log("resetToken already exists or error:", err.message);
    } else {
      console.log("resetToken column added");
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN resetExpiry INTEGER`, (err) => {
    if (err) {
      console.log("resetExpiry already exists or error:", err.message);
    } else {
      console.log("resetExpiry column added");
    }
  });
});