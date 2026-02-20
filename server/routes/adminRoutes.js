const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const db = require("../config/db");

/* ================= ALL USERS ================= */
router.get("/users", auth, admin, async (req, res) => {
  const users = await db.query(
    "SELECT id, name, email, role, created_at FROM users"
  );
  res.json(users.rows);
});

/* ================= ALL TRADES ================= */
router.get("/trades", auth, admin, async (req, res) => {
  const trades = await db.query(
    "SELECT * FROM trades ORDER BY created_at DESC"
  );
  res.json(trades.rows);
});

/* ================= ALL ORDERS ================= */
router.get("/orders", auth, admin, async (req, res) => {
  const orders = await db.query(
    "SELECT * FROM orders ORDER BY created_at DESC"
  );
  res.json(orders.rows);
});

module.exports = router;