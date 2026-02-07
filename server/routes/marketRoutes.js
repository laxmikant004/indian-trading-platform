const express = require("express");
const router = express.Router();

const marketController = require("../controllers/marketController");
const authMiddleware = require("../middleware/authMiddleware"); // 👈 add this

router.get("/", authMiddleware, marketController.getMarketData); // 👈 protect route

module.exports = router;
