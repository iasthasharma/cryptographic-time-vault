require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// ================================
// CREATE UPLOADS FOLDER SAFELY
// ================================
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("📁 uploads folder created");
}

// ================================
// ROUTES
// ================================
const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const fileRoutes = require("./routes/fileRoutes");
const db = require("./models/db");

// ================================
// MIDDLEWARE
// ================================
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================================
// ROUTE MOUNTING
// ================================
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/logs", logRoutes);

// ================================
// HEALTH CHECK
// ================================
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// ================================
// START SERVER
// ================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Connected to SQLite database");
});