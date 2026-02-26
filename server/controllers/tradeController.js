const db = require("../config/db");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
});

/* ================= SYMBOL FORMAT ================= */
const formatSymbol = (symbol) => {
  let formatted = symbol.toUpperCase().trim();
  if (formatted.startsWith("^")) return formatted; // Index
  if (!formatted.includes(".")) formatted += ".NS"; // NSE default
  return formatted;
};

/* ================= BUY STOCK ================= */
exports.buyStock = async (req, res) => {
  try {
    const { symbol, quantity, order_type, price } = req.body;
    const userId = req.user.id;

    if (!symbol || !quantity || quantity <= 0)
      return res.status(400).json({ message: "Invalid input" });

    const formattedSymbol = formatSymbol(symbol);

    const quote = await yahooFinance.quote(formattedSymbol);
    const marketPrice = quote?.regularMarketPrice;

    if (!marketPrice) return res.status(400).json({ message: "Invalid stock symbol" });

    // ================= MARKET ORDER =================
    if (order_type === "MARKET") {
      const total = marketPrice * quantity;

      const balanceResult = await db.query(
        "SELECT balance FROM portfolios WHERE user_id=$1",
        [userId]
      );
      const balance = balanceResult.rows[0]?.balance || 0;

      if (balance < total) return res.status(400).json({ message: "Insufficient balance" });

      await db.query(
        "UPDATE portfolios SET balance = balance - $1 WHERE user_id=$2",
        [total, userId]
      );

      await db.query(
        `INSERT INTO trades (user_id, symbol, type, quantity, price, total)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [userId, formattedSymbol, "BUY", quantity, marketPrice, total]
      );

      return res.json({ message: "Market order executed" });
    }

    // ================= LIMIT / STOP_LOSS =================
    if (order_type === "LIMIT" || order_type === "STOP_LOSS") {
      if (!price || price <= 0)
        return res.status(400).json({ message: "Invalid price" });

      await db.query(
        `INSERT INTO orders (user_id, symbol, type, order_type, quantity, price, status)
         VALUES ($1,$2,$3,$4,$5,$6,'PENDING')`,
        [userId, formattedSymbol, "BUY", order_type, quantity, price]
      );

      return res.json({ message: `${order_type} order placed successfully` });
    }

  } catch (err) {
    console.error("BUY ERROR:", err);
    res.status(500).json({ message: "Trade failed" });
  }
};

/* ================= SELL STOCK ================= */
exports.sellStock = async (req, res) => {
  try {
    const { symbol, quantity, order_type, price } = req.body;
    const userId = req.user.id;

    if (!symbol || !quantity || quantity <= 0)
      return res.status(400).json({ message: "Invalid input" });

    const formattedSymbol = formatSymbol(symbol);

    // Check user holdings
    const trades = await db.query(
      `SELECT SUM(CASE WHEN type='BUY' THEN quantity ELSE -quantity END) AS net_qty
       FROM trades WHERE user_id=$1 AND symbol=$2`,
      [userId, formattedSymbol]
    );
    const netQty = parseInt(trades.rows[0]?.net_qty || 0);

    if (quantity > netQty) return res.status(400).json({ message: "Not enough shares to sell" });

    const quote = await yahooFinance.quote(formattedSymbol);
    const marketPrice = quote?.regularMarketPrice;

    // ================= MARKET =================
    if (order_type === "MARKET") {
      const total = marketPrice * quantity;

      await db.query(
        "UPDATE portfolios SET balance = balance + $1 WHERE user_id=$2",
        [total, userId]
      );

      await db.query(
        `INSERT INTO trades (user_id, symbol, type, quantity, price, total)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [userId, formattedSymbol, "SELL", quantity, marketPrice, total]
      );

      return res.json({ message: "Market sell executed" });
    }

    // ================= LIMIT / STOP_LOSS =================
    if (order_type === "LIMIT" || order_type === "STOP_LOSS") {
      if (!price || price <= 0)
        return res.status(400).json({ message: "Invalid price" });

      await db.query(
        `INSERT INTO orders (user_id, symbol, type, order_type, quantity, price, status)
         VALUES ($1,$2,$3,$4,$5,$6,'PENDING')`,
        [userId, formattedSymbol, "SELL", order_type, quantity, price]
      );

      return res.json({ message: `${order_type} sell order placed` });
    }

  } catch (err) {
    console.error("SELL ERROR:", err);
    res.status(500).json({ message: "Sell failed" });
  }
};

/* ================= TRADE HISTORY ================= */
exports.getTradeHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT * FROM trades WHERE user_id=$1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trade history" });
  }
};