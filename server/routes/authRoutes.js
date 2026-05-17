const crypto = require("crypto");
const sendMail = require("../utils/mailer");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const { logAction } = require("../utils/logger");


const SECRET_KEY = "your-jwt-secret-key";

/*
========================================
REGISTER (UNCHANGED)
========================================
*/
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hasSpace = (str) => /\s/.test(str);

  if (hasSpace(username)) return res.status(400).send("Username cannot contain spaces");
  if (hasSpace(password)) return res.status(400).send("Password cannot contain spaces");
  if (password.length < 8) return res.status(400).send("Password must be at least 8 characters");

  if (!username || !email || !password) {
    return res.status(400).send("Username, email and password required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
      async function (err) {
        if (err) return res.status(400).send("Username or email already exists");

        logAction(this.lastID, "REGISTER", null);

        try {
          await sendMail(email, "Welcome to Vaultix 🔐", `Hi ${username}, your account is ready.`);
        } catch (e) {
          console.error(e);
        }

        res.status(201).send("User registered successfully");
      }
    );
  } catch (error) {
    res.status(500).send("Server error");
  }
});

/*
========================================
LOGIN (UNCHANGED)
========================================
*/
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username = ? OR email = ?`,
    [username, username],
    async (err, user) => {
      if (!user) return res.status(400).send("Invalid credentials");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).send("Invalid credentials");

      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: "7d" }
      );

      logAction(user.id, "LOGIN", null);

      try {
        await sendMail(
          user.email,
          "Vaultix Login Alert ⚠️",
          "New login detected on your account."
        );
      } catch (e) {
        console.error(e);
      }

      res.json({ token });
    }
  );
});

/*
========================================
1. FORGOT PASSWORD (NEW)
========================================
*/
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).send("Email required");

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (!user) return res.status(400).send("User not found");

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1000 * 60 * 15; // 15 minutes

    db.run(
      `UPDATE users SET resetToken = ?, resetExpiry = ? WHERE email = ?`,
      [token, expiry, email],
      async (err) => {
        if (err) return res.status(500).send("DB error");

        const resetLink = `http://localhost:5173/reset-password/${token}`;

        try {
          await sendMail(
            email,
            "Vaultix Password Reset",
            `Click below to reset your password (valid 15 min):\n\n${resetLink}`
          );

          res.send("Reset link sent to email");
        } catch (e) {
          console.error(e);
          res.status(500).send("Email failed");
        }
      }
    );
  });
});

/*
========================================
2. RESET PASSWORD (NEW)
========================================
*/
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).send("Missing fields");
  }

  if (newPassword.length < 8) {
    return res.status(400).send("Password must be at least 8 characters");
  }

  db.get(
    `SELECT * FROM users WHERE resetToken = ?`,
    [token],
    async (err, user) => {
      if (!user) return res.status(400).send("Invalid or expired token");

      if (Date.now() > user.resetExpiry) {
        return res.status(400).send("Token expired");
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      db.run(
        `UPDATE users SET password = ?, resetToken = NULL, resetExpiry = NULL WHERE id = ?`,
        [hashed, user.id],
        (err) => {
          if (err) return res.status(500).send("Update failed");

          res.send("Password reset successful");
        }
      );
    }
  );
});

module.exports = router;