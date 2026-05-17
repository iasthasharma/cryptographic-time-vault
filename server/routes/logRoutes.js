const express = require("express");
const router = express.Router();
const db = require("../models/db");
const authMiddleware = require("../middleware/authMiddleware");

/*
========================================
GET /logs/
Fetch current user's security logs
========================================
*/
router.get("/", authMiddleware, (req, res) => {
  db.all(
    `SELECT * FROM logs
     WHERE userId = ?
     ORDER BY id DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Error fetching logs");
      }

      res.json(rows);
    }
  );
});

module.exports = router;