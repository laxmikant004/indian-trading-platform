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

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:3000",
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

/* ================= ORDER EXECUTION ENGINE ================= */
const db = require("./config/db");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

setInterval(async () => {
  try {
    const pendingOrders = await db.query(
      "SELECT * FROM orders WHERE status='PENDING'"
    );

    for (const order of pendingOrders.rows) {
      const quote = await yahooFinance.quote(order.symbol);
      const marketPrice = quote.regularMarketPrice;

      let shouldExecute = false;

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

      if (shouldExecute) {
        const total = marketPrice * order.quantity;

        // Update balance
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

        // Insert into trades
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

        // Mark executed
        await db.query(
          "UPDATE orders SET status='EXECUTED' WHERE id=$1",
          [order.id]
        );
      }
    }
  } catch (err) {
    console.error("ORDER ENGINE ERROR:", err);
  }
}, 15000);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});