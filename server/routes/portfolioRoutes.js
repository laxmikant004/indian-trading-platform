const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getPortfolio } = require("../controllers/portfolioController");

router.get("/", auth, getPortfolio);

module.exports = router;
