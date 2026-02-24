const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Register & Login
router.post("/register", authController.register);
router.post("/login", authController.login);

// 🔒 Profile route
router.get("/profile", authMiddleware, authController.getProfile);

// 🔹 Forgot / Reset password
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;