const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  buyStock,
  sellStock,
  getTradeHistory
} = require("../controllers/tradeController");

router.post("/buy", auth, buyStock);
router.post("/sell", auth, sellStock);
router.get("/history", auth, getTradeHistory);

module.exports = router;