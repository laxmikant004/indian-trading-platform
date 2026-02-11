const pool = require("../config/db");

/* Add stock to watchlist */
exports.addToWatchlist = async (req, res) => {
  const userId = req.user.id;
  const { symbol, name } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO watchlist (user_id, symbol, name) VALUES ($1, $2, $3) RETURNING *",
      [userId, symbol, name]
    );

    res.status(201).json({
      message: "Stock added to watchlist",
      stock: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "Stock already in watchlist" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/* Get user watchlist */
exports.getWatchlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM watchlist WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* Remove stock */
exports.removeFromWatchlist = async (req, res) => {
  const userId = req.user.id;
  const { symbol } = req.params;

  await pool.query(
    "DELETE FROM watchlist WHERE user_id = $1 AND symbol = $2",
    [userId, symbol]
  );

  res.json({ message: "Stock removed from watchlist" });
};
