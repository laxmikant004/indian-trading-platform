const jwt = require("jsonwebtoken");
const db = require("../config/db");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB (never trust token role blindly)
    const userResult = await db.query(
      "SELECT id, role FROM users WHERE id = $1",
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    const user = userResult.rows[0];

    // 🚫 Blocked users cannot access APIs
    if (user.role === "BLOCKED") {
      return res.status(403).json({
        message: "Your account has been blocked. Contact administrator.",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }

    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;