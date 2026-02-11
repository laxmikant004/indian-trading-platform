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
exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    const portfolio = await pool.query(
      "SELECT balance FROM portfolios WHERE user_id = $1",
      [userId]
    );

    const trades = await pool.query(
      "SELECT * FROM trades WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json({
      balance: portfolio.rows[0].balance,
      trades: trades.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
