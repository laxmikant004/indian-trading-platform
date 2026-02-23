const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Please login.",
      });
    }

    if (req.user.role !== "ADMIN") {
      console.warn(
        `Unauthorized admin access attempt by user ID: ${req.user.id}`
      );

      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;