const express = require("express");
const router = express.Router();

const marketController = require("../controllers/marketController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, marketController.getMarketData);

// 🔎 Search single stock
router.get("/search/:symbol", authMiddleware, marketController.searchStock);

// 🔥 Auto suggestions
router.get("/suggestions", authMiddleware, marketController.searchSuggestions);

router.get("/movers", authMiddleware, marketController.getTopMovers);

module.exports = router;
