const jwt = require("jsonwebtoken");

const SECRET_KEY = "your-jwt-secret-key";

const authMiddleware = (req, res, next) => {
  /*
  ========================================
  Accept token from:
  1. Authorization header
  2. Query param (download links)
  ========================================
  */
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.query.token;

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);

    req.user = verified;

    next();
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};

module.exports = authMiddleware;