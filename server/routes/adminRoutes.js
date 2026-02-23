const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const db = require("../config/db");

/* ================= ADMIN STATS ================= */
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const users = await db.query("SELECT COUNT(*) FROM users");
    const orders = await db.query("SELECT COUNT(*) FROM orders");
    const trades = await db.query("SELECT COUNT(*) FROM trades");
    const revenue = await db.query("SELECT COALESCE(SUM(total),0) FROM trades");

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalOrders: parseInt(orders.rows[0].count),
      totalTrades: parseInt(trades.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].coalesce),
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});


/* ================= ALL USERS ================= */
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await db.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(users.rows);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


/* ================= BLOCK USER ================= */
router.put("/users/:id/block", auth, admin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from blocking themselves
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    await db.query(
      "UPDATE users SET role = $1 WHERE id = $2",
      ["BLOCKED", userId]
    );

    res.json({ message: "User blocked successfully" });

  } catch (error) {
    console.error("BLOCK USER ERROR:", error);
    res.status(500).json({ message: "Failed to block user" });
  }
});


/* ================= UNBLOCK USER ================= */
router.put("/users/:id/unblock", auth, admin, async (req, res) => {
  try {
    const userId = req.params.id;

    await db.query(
      "UPDATE users SET role = $1 WHERE id = $2",
      ["USER", userId]
    );

    res.json({ message: "User unblocked successfully" });

  } catch (error) {
    console.error("UNBLOCK USER ERROR:", error);
    res.status(500).json({ message: "Failed to unblock user" });
  }
});


/* ================= DELETE USER ================= */
router.delete("/users/:id", auth, admin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});


/* ================= ALL TRADES ================= */
router.get("/trades", auth, admin, async (req, res) => {
  try {
    const trades = await db.query(
      "SELECT * FROM trades ORDER BY created_at DESC"
    );
    res.json(trades.rows);
  } catch (error) {
    console.error("GET TRADES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch trades" });
  }
});


/* ================= ALL ORDERS ================= */
router.get("/orders", auth, admin, async (req, res) => {
  try {
    const orders = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res.json(orders.rows);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


module.exports = router;