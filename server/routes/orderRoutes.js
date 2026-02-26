const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  placeOrder,
  cancelOrder,
  getUserOrders,
  getPendingOrders,
  modifyOrder
} = require("../controllers/orderController");

// ================== PLACE ORDER ==================
router.post("/", auth, placeOrder);

// ================== CANCEL ORDER ==================
router.put("/cancel/:id", auth, cancelOrder);

// ================== MODIFY ORDER ==================
router.put("/modify/:id", auth, modifyOrder);

// ================== GET USER ORDERS ==================
router.get("/my-orders", auth, getUserOrders);

// ================== GET PENDING ORDERS ==================
router.get("/pending", auth, getPendingOrders);

module.exports = router;