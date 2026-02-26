const db = require("../config/db");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

// Helper
const formatSymbol = (symbol) =>
  symbol.includes(".NS") ? symbol : `${symbol}.NS`;

/* ================= PLACE ORDER ================= */
exports.placeOrder = async (req, res) => {
  const client = await db.connect();

  try {
    const { symbol, quantity, type, order_type, price } = req.body;
    const userId = req.user.id;

    if (!symbol || !quantity || !type || !order_type) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const formattedSymbol = formatSymbol(symbol);

    await client.query("BEGIN");

    // ================= MARKET ORDER =================
    if (order_type === "MARKET") {
      const quote = await yahooFinance.quote(formattedSymbol);
      const marketPrice = quote?.regularMarketPrice;

      if (!marketPrice) {
        throw new Error("Invalid stock symbol");
      }

      const total = marketPrice * quantity;

      if (type === "BUY") {
        const balanceResult = await client.query(
          "SELECT balance FROM portfolios WHERE user_id=$1 FOR UPDATE",
          [userId]
        );

        const balance = balanceResult.rows[0]?.balance || 0;

        if (balance < total) {
          throw new Error("Insufficient balance");
        }

        await client.query(
          "UPDATE portfolios SET balance = balance - $1 WHERE user_id=$2",
          [total, userId]
        );
      }

      if (type === "SELL") {
        const holding = await client.query(
          `SELECT COALESCE(SUM(CASE WHEN type='BUY' THEN quantity
                                   WHEN type='SELL' THEN -quantity END),0) as qty
           FROM trades
           WHERE user_id=$1 AND symbol=$2
           FOR UPDATE`,
          [userId, formattedSymbol]
        );

        const available = holding.rows[0].qty;

        if (available < quantity) {
          throw new Error("Not enough shares");
        }

        await client.query(
          "UPDATE portfolios SET balance = balance + $1 WHERE user_id=$2",
          [total, userId]
        );
      }

      await client.query(
        `INSERT INTO trades (user_id, symbol, type, quantity, price, total)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [userId, formattedSymbol, type, quantity, marketPrice, total]
      );

      await client.query("COMMIT");

      return res.json({ message: "Market order executed successfully" });
    }

    // ================= LIMIT / STOP LOSS =================
    if (order_type === "LIMIT" || order_type === "STOP_LOSS") {
      if (!price || price <= 0) {
        throw new Error("Invalid price");
      }

      await client.query(
        `INSERT INTO orders
         (user_id, symbol, type, order_type, quantity, price, status)
         VALUES ($1,$2,$3,$4,$5,$6,'PENDING')`,
        [userId, formattedSymbol, type, order_type, quantity, price]
      );

      await client.query("COMMIT");

      return res.json({
        message: `${order_type} order placed successfully`,
      });
    }

    throw new Error("Invalid order type");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ORDER ERROR:", err.message);
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
};

/* ================= CANCEL ORDER ================= */
exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const result = await db.query(
      `UPDATE orders
       SET status='CANCELLED'
       WHERE id=$1 AND user_id=$2 AND status='PENDING'
       RETURNING *`,
      [orderId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "Order not found or already executed",
      });
    }

    res.json({ message: "Order cancelled successfully" });

  } catch (err) {
    console.error("CANCEL ERROR:", err);
    res.status(500).json({ message: "Cancel failed" });
  }
};

/* ================= GET USER ORDERS ================= */
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await db.query(
      `SELECT * FROM orders
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(orders.rows);

  } catch (err) {
    console.error("FETCH ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================= GET PENDING ORDERS ================= */
exports.getPendingOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT * FROM orders WHERE user_id=$1 AND status='PENDING' ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET PENDING ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch pending orders" });
  }
};

/* ================= MODIFY ORDER ================= */
exports.modifyOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;
  const { quantity, price } = req.body;

  try {
    // Fetch order first
    const existing = await db.query(
      "SELECT * FROM orders WHERE id=$1 AND user_id=$2",
      [orderId, userId]
    );

    if (!existing.rows.length)
      return res.status(404).json({ message: "Order not found" });

    const order = existing.rows[0];

    // 🚫 Prevent MARKET modification
    if (order.order_type === "MARKET")
      return res.status(400).json({
        message: "Market orders cannot be modified"
      });

    // 🚫 Prevent non-pending modification
    if (order.status !== "PENDING")
      return res.status(400).json({
        message: "Only pending orders can be modified"
      });

    const result = await db.query(
      `UPDATE orders
       SET quantity=$1, price=$2
       WHERE id=$3
       RETURNING *`,
      [quantity, price, orderId]
    );

    res.json({ message: "Order modified", order: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};