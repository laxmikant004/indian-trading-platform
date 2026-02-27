const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const app = express();

const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

/* ================= IMPORT ROUTES ================= */
const marketRoutes = require("./routes/marketRoutes");
const authRoutes = require("./routes/authRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminAnalyticsRoutes = require("./routes/adminAnalytics");

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/market", marketRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAnalyticsRoutes);
/* ================= HEALTH CHECK ================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

/* ================= PRODUCTION SAFE ORDER EXECUTION ENGINE ================= */

const executeOrders = async () => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Lock pending orders so they can't be executed twice
    const { rows: orders } = await client.query(`
      SELECT * FROM orders
      WHERE status = 'PENDING'
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
    `);

    for (const order of orders) {
      const quote = await yahooFinance.quote(order.symbol);
      const marketPrice = quote?.regularMarketPrice;

      if (!marketPrice) continue;

      let shouldExecute = false;
      let executedPrice = marketPrice;

      /* ================= ORDER TYPE LOGIC ================= */

      if (order.order_type === "LIMIT") {
        if (order.type === "BUY" && marketPrice <= order.price)
          shouldExecute = true;

        if (order.type === "SELL" && marketPrice >= order.price)
          shouldExecute = true;
      }

      if (order.order_type === "STOP_LOSS") {
        if (order.type === "SELL" && marketPrice <= order.price)
          shouldExecute = true;
      }

      if (!shouldExecute) continue;

      const total = executedPrice * order.quantity;

      /* ================= BUY VALIDATION ================= */

      if (order.type === "BUY") {
        const balanceResult = await client.query(
          `SELECT balance 
           FROM portfolios 
           WHERE user_id=$1 
           FOR UPDATE`,
          [order.user_id]
        );

        const balance = balanceResult.rows[0]?.balance || 0;

        if (balance < total) {
          await client.query(
            "UPDATE orders SET status='CANCELLED' WHERE id=$1",
            [order.id]
          );
          console.log(`❌ Cancelled order ${order.id} (insufficient balance)`);
          continue;
        }

        await client.query(
          "UPDATE portfolios SET balance = balance - $1 WHERE user_id=$2",
          [total, order.user_id]
        );
      }

      /* ================= SELL VALIDATION ================= */

      if (order.type === "SELL") {
        const holdingResult = await client.query(
          `SELECT COALESCE(SUM(
              CASE 
                WHEN type='BUY' THEN quantity
                WHEN type='SELL' THEN -quantity
              END
            ),0) AS qty
           FROM trades
           WHERE user_id=$1 AND symbol=$2
           FOR UPDATE`,
          [order.user_id, order.symbol]
        );

        const availableShares = parseInt(holdingResult.rows[0].qty || 0);

        if (availableShares < order.quantity) {
          await client.query(
            "UPDATE orders SET status='CANCELLED' WHERE id=$1",
            [order.id]
          );
          console.log(`❌ Cancelled order ${order.id} (not enough shares)`);
          continue;
        }

        await client.query(
          "UPDATE portfolios SET balance = balance + $1 WHERE user_id=$2",
          [total, order.user_id]
        );
      }

      /* ================= INSERT TRADE ================= */

      await client.query(
        `INSERT INTO trades (user_id, symbol, type, quantity, price, total)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          order.user_id,
          order.symbol,
          order.type,
          order.quantity,
          executedPrice,
          total
        ]
      );

      /* ================= UPDATE ORDER STATUS ================= */

      await client.query(
        "UPDATE orders SET status='EXECUTED' WHERE id=$1",
        [order.id]
      );

      console.log(
        `✅ Executed ${order.type} ${order.symbol} | Qty: ${order.quantity} @ ₹${executedPrice}`
      );
    }

    await client.query("COMMIT");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("🚨 ORDER ENGINE ERROR:", err);
  } finally {
    client.release();
  }
};


// Run every 15 seconds
setInterval(executeOrders, 15000);

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});