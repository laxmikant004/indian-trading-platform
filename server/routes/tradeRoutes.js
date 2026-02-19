const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/buy", authMiddleware, tradeController.buyStock);
router.post("/sell", authMiddleware, tradeController.sellStock);
router.get("/portfolio", authMiddleware, tradeController.getPortfolio);
const auth = require("../middleware/authMiddleware");

// Import all trade functions from controller at once
const { buyStock, sellStock, getTradeHistory, getPortfolio } = require("../controllers/tradeController");

// Routes
router.post("/buy", auth, buyStock);
router.post("/sell", auth, sellStock);
router.get("/history", auth, getTradeHistory);
router.get("/portfolio", auth, getPortfolio);

module.exports = router;
