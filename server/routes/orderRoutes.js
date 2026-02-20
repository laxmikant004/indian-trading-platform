const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { placeOrder } = require("../controllers/orderController");

router.post("/", auth, placeOrder);

module.exports = router;