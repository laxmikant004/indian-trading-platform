const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ================= IMPORT ROUTES ================= */
const marketRoutes = require("./routes/marketRoutes");
const authRoutes = require("./routes/authRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

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

/* ================= HEALTH CHECK ================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

/* ================= ORDER EXECUTION ENGINE ================= */
const db = require("./config/db");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

const executeOrders = async () => {
  try {
    const pendingOrders = await db.query(
      "SELECT * FROM orders WHERE status='PENDING'"
    );

    for (const order of pendingOrders.rows) {
      const quote = await yahooFinance.quote(order.symbol);
      const marketPrice = quote?.regularMarketPrice;

      if (!marketPrice) continue;

      let shouldExecute = false;

      // LIMIT Orders
      if (order.order_type === "LIMIT") {
        if (order.type === "BUY" && marketPrice <= order.price)
          shouldExecute = true;

        if (order.type === "SELL" && marketPrice >= order.price)
          shouldExecute = true;
      }

      // STOP LOSS
      if (order.order_type === "STOP_LOSS") {
        if (order.type === "SELL" && marketPrice <= order.price)
          shouldExecute = true;
      }

      if (shouldExecute) {
        const total = marketPrice * order.quantity;

        // Update portfolio balance
        if (order.type === "BUY") {
          await db.query(
            "UPDATE portfolios SET balance = balance - $1 WHERE user_id=$2",
            [total, order.user_id]
          );
        } else {
          await db.query(
            "UPDATE portfolios SET balance = balance + $1 WHERE user_id=$2",
            [total, order.user_id]
          );
        }

        // Insert trade record
        await db.query(
          `INSERT INTO trades (user_id, symbol, type, quantity, price, total)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            order.user_id,
            order.symbol,
            order.type,
            order.quantity,
            marketPrice,
            total,
          ]
        );

        // Mark order as executed
        await db.query(
          "UPDATE orders SET status='EXECUTED' WHERE id=$1",
          [order.id]
        );

        console.log(
          `✅ Order Executed: ${order.symbol} (${order.type}) @ ₹${marketPrice}`
        );
      }
    }
  } catch (err) {
    console.error("ORDER ENGINE ERROR:", err.message);
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