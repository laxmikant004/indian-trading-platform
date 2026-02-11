const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/buy", authMiddleware, tradeController.buyStock);
router.post("/sell", authMiddleware, tradeController.sellStock);
router.get("/portfolio", authMiddleware, tradeController.getPortfolio);

module.exports = router;
