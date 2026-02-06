const express = require("express");
const router = express.Router();

const marketController = require("../controllers/marketController");

router.get("/", marketController.getMarketData);

module.exports = router;
