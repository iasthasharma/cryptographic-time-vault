const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/vault.db", (err) => {
  if (err) {
    console.error("Database connection failed", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

/*
========================================
FILES TABLE
========================================
*/
db.run(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    originalName TEXT,
    storedName TEXT,
    unlockTime TEXT,
    uploadTime TEXT
  )
`);

/*
========================================
USERS TABLE
========================================
*/
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT,
    password TEXT,
    role TEXT DEFAULT 'user'
  )
`);

/*
========================================
LOGS TABLE
========================================
*/
db.run(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    action TEXT,
    fileName TEXT,
    timestamp TEXT
  )
`);

module.exports = db;