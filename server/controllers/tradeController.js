<<<<<<< HEAD
const pool = require("../config/db");

// BUY STOCK
exports.buyStock = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const total = quantity * price;

    // Get user portfolio
    const portfolio = await pool.query(
      "SELECT * FROM portfolios WHERE user_id = $1",
      [userId]
    );

    if (portfolio.rows.length === 0) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const currentBalance = portfolio.rows[0].balance;

    if (currentBalance < total) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    await pool.query(
      "UPDATE portfolios SET balance = balance - $1 WHERE user_id = $2",
      [total, userId]
    );

    // Save trade
    await pool.query(
      "INSERT INTO trades (user_id, symbol, type, quantity, price, total) VALUES ($1,$2,'BUY',$3,$4,$5)",
      [userId, symbol, quantity, price, total]
    );

    res.status(200).json({ message: "Stock purchased successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// SELL STOCK
exports.sellStock = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Calculate total owned quantity
    const result = await pool.query(
      `SELECT 
        SUM(CASE WHEN type='BUY' THEN quantity ELSE 0 END) -
        SUM(CASE WHEN type='SELL' THEN quantity ELSE 0 END)
       AS owned
       FROM trades
       WHERE user_id=$1 AND symbol=$2`,
      [userId, symbol]
    );

    const owned = result.rows[0].owned || 0;

    if (owned < quantity) {
      return res.status(400).json({ message: "Not enough shares to sell" });
    }

    const total = quantity * price;

    // Add balance
    await pool.query(
      "UPDATE portfolios SET balance = balance + $1 WHERE user_id = $2",
      [total, userId]
    );

    // Save trade
    await pool.query(
      "INSERT INTO trades (user_id, symbol, type, quantity, price, total) VALUES ($1,$2,'SELL',$3,$4,$5)",
      [userId, symbol, quantity, price, total]
    );

    res.status(200).json({ message: "Stock sold successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET PORTFOLIO
=======
const db = require("../config/db");
const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
});

/* ================= SYMBOL FORMAT ================= */
const formatSymbol = (symbol) => {
  let formatted = symbol.toUpperCase().trim();

  // If index → return as is
  if (formatted.startsWith("^")) {
    return formatted;
  }

  if (!formatted.includes(".")) {
    formatted += ".NS";
  }

  return formatted;
};

/* ================= BUY STOCK ================= */
exports.buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user.id;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid symbol or quantity" });
    }

    const formattedSymbol = formatSymbol(symbol);

    // ❌ Prevent index trading
    if (formattedSymbol.startsWith("^")) {
      return res.status(400).json({
        message: "Indexes cannot be traded. Please select a stock."
      });
    }

    const quote = await yahooFinance.quote(formattedSymbol);

    if (!quote || !quote.regularMarketPrice) {
      return res.status(400).json({ message: "Invalid stock symbol" });
    }

    const price = quote.regularMarketPrice;
    const total = price * quantity;

    const balanceResult = await db.query(
      "SELECT balance FROM portfolios WHERE user_id=$1",
      [userId]
    );

    const balance = balanceResult.rows[0]?.balance || 0;

    if (balance < total) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    await db.query(
      "UPDATE portfolios SET balance = balance - $1 WHERE user_id=$2",
      [total, userId]
    );

    await db.query(
      "INSERT INTO trades (user_id, symbol, type, quantity, price, total) VALUES ($1,$2,$3,$4,$5,$6)",
      [userId, formattedSymbol, "BUY", quantity, price, total]
    );

    res.json({ message: "Stock bought successfully" });

  } catch (err) {
    console.error("BUY ERROR:", err);
    res.status(500).json({ message: "Trade failed" });
  }
};

/* ================= SELL STOCK ================= */
exports.sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user.id;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid symbol or quantity" });
    }

    const formattedSymbol = formatSymbol(symbol);

    if (formattedSymbol.startsWith("^")) {
      return res.status(400).json({
        message: "Indexes cannot be traded."
      });
    }

    const trades = await db.query(
      `SELECT SUM(CASE WHEN type='BUY' THEN quantity ELSE -quantity END) AS net_qty 
       FROM trades WHERE user_id=$1 AND symbol=$2`,
      [userId, formattedSymbol]
    );

    const netQty = parseInt(trades.rows[0]?.net_qty || 0);

    if (quantity > netQty) {
      return res.status(400).json({ message: "Not enough shares to sell" });
    }

    const quote = await yahooFinance.quote(formattedSymbol);

    const price = quote.regularMarketPrice;
    const total = price * quantity;

    await db.query(
      "UPDATE portfolios SET balance = balance + $1 WHERE user_id=$2",
      [total, userId]
    );

    await db.query(
      "INSERT INTO trades (user_id, symbol, type, quantity, price, total) VALUES ($1,$2,$3,$4,$5,$6)",
      [userId, formattedSymbol, "SELL", quantity, price, total]
    );

    res.json({ message: "Stock sold successfully" });

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

/* ================= PORTFOLIO ================= */
>>>>>>> bbb183b (Sprint 2 almost compeleted...)
exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

<<<<<<< HEAD
    const portfolio = await pool.query(
      "SELECT balance FROM portfolios WHERE user_id = $1",
      [userId]
    );

    const trades = await pool.query(
      "SELECT * FROM trades WHERE user_id = $1 ORDER BY created_at DESC",
=======
    const balanceResult = await db.query(
      "SELECT balance FROM portfolios WHERE user_id=$1",
      [userId]
    );

    const holdingsResult = await db.query(
      `
      SELECT symbol,
             SUM(CASE WHEN type='BUY' THEN quantity ELSE -quantity END) AS quantity,
             (
               SUM(CASE WHEN type='BUY' THEN price*quantity ELSE 0 END)
               /
               NULLIF(SUM(CASE WHEN type='BUY' THEN quantity ELSE 0 END),0)
             )::float AS avg_price
      FROM trades
      WHERE user_id=$1
      GROUP BY symbol
      HAVING SUM(CASE WHEN type='BUY' THEN quantity ELSE -quantity END) > 0
      `,
>>>>>>> bbb183b (Sprint 2 almost compeleted...)
      [userId]
    );

    res.json({
<<<<<<< HEAD
      balance: portfolio.rows[0].balance,
      trades: trades.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
=======
      balance: balanceResult.rows[0]?.balance || 0,
      holdings: holdingsResult.rows
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch portfolio" });
>>>>>>> bbb183b (Sprint 2 almost compeleted...)
  }
};
