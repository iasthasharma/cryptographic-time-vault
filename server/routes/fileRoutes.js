const sendMail = require("../utils/mailer");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../models/db");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");

const { encryptFile, decryptFile } = require("../utils/encryption");
const { logAction } = require("../utils/logger");

/*
========================================
SAFE UPLOAD DIRECTORY
========================================
*/
const uploadDir = path.join(__dirname, "../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/*
========================================
MULTER SETUP
========================================
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/*
========================================
UPLOAD FILE (STABLE + SAFE)
========================================
*/
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const { unlockTime } = req.body;

      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const originalName = req.file.originalname;
      const tempPath = req.file.path;
      const encryptedName = req.file.filename + ".enc";
      const encryptedPath = path.join(uploadDir, encryptedName);

      // Safety check
      if (!fs.existsSync(tempPath)) {
        return res.status(400).send("Uploaded file missing");
      }

      try {
        // Encrypt file safely
        await Promise.resolve(encryptFile(tempPath, encryptedPath));

        // Delete temp file safely
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      } catch (encErr) {
        console.error("Encryption error:", encErr);
        return res.status(500).send("File encryption failed");
      }

      const uploadTime = new Date().toISOString();

      db.run(
        `INSERT INTO files (userId, originalName, storedName, unlockTime, uploadTime)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, originalName, encryptedName, unlockTime, uploadTime],
        function (err) {
          if (err) {
            console.error("DB error:", err.message);
            return res.status(500).send("Database insert failed");
          }

          logAction(req.user.id, "UPLOAD", originalName);

          // ============================
          // EMAIL NOTIFICATION (SAFE)
          // ============================
          db.get(
            "SELECT email, username FROM users WHERE id = ?",
            [req.user.id],
            (err, user) => {
              if (err || !user?.email) return;

              sendMail(
                user.email,
                "Vaultix File Uploaded 📁",
                `Hi ${user.username},

Your file "${originalName}" has been securely encrypted and stored.

Unlock Time: ${unlockTime}

- Vaultix Security System`
              )
                .then(() => console.log("Upload email sent"))
                .catch((e) => console.error("Email error:", e));
            }
          );

          return res.send("File uploaded and encrypted successfully");
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).send("Server error");
    }
  }
);

/*
========================================
GET USER FILES
========================================
*/
router.get("/", authMiddleware, (req, res) => {
  db.all(
    "SELECT * FROM files WHERE userId = ? ORDER BY id DESC",
    [req.user.id],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Error fetching files");
      }

      res.json(rows);
    }
  );
});

/*
========================================
DOWNLOAD FILE (FULLY SAFE)
========================================
*/
router.get("/download/:id", authMiddleware, (req, res) => {
  const fileId = req.params.id;

  db.get(
    "SELECT * FROM files WHERE id = ? AND userId = ?",
    [fileId, req.user.id],
    async (err, file) => {
      if (err || !file) {
        return res.status(404).send("File not found");
      }

      if (!file.storedName) {
        return res.status(404).send("Invalid file record");
      }

      const encryptedPath = path.join(uploadDir, file.storedName);

      if (!fs.existsSync(encryptedPath)) {
        return res.status(404).send("File missing on server");
      }

      const now = new Date();
      const unlockDate = new Date(file.unlockTime);

      if (now < unlockDate) {
        logAction(req.user.id, "EARLY_ACCESS_BLOCKED", file.originalName);
        return res.status(403).send("File is still locked");
      }

      try {
        const decryptedPath = path.join(
          uploadDir,
          "temp-" + file.originalName
        );

        await decryptFile(encryptedPath, decryptedPath);

        logAction(req.user.id, "DOWNLOAD", file.originalName);

        res.download(decryptedPath, file.originalName, (err) => {
          if (err) console.error(err);

          if (fs.existsSync(decryptedPath)) {
            fs.unlinkSync(decryptedPath);
          }
        });
      } catch (error) {
        console.error("Decryption error:", error);
        res.status(500).send("Decryption failed");
      }
    }
  );
});

module.exports = router;