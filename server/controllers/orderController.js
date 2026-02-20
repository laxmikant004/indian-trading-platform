const db = require("../config/db");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
});

/* ================= PLACE ORDER ================= */
exports.placeOrder = async (req, res) => {
  try {
    const { symbol, quantity, type, order_type, price } = req.body;
    const userId = req.user.id;

    if (!symbol || !quantity || !type || !order_type) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await db.query(
      `INSERT INTO orders (user_id, symbol, type, order_type, quantity, price)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [userId, symbol.toUpperCase(), type, order_type, quantity, price || null]
    );

    res.json({ message: "Order placed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order failed" });
  }
};