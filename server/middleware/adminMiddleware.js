const jwt = require("jsonwebtoken");

const SECRET_KEY = "your-jwt-secret-key";

/*
========================================
Admin Only Middleware
========================================
*/
const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Access denied");
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, SECRET_KEY);

    if (verified.role !== "admin") {
      return res.status(403).send("Admin access required");
    }

    req.user = verified;

    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

module.exports = adminMiddleware;