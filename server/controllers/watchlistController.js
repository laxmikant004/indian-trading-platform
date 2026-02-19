const db = require("../config/db");

/* ADD TO WATCHLIST */
exports.addToWatchlist = async (req, res) => {
  try {
    const { symbol, name } = req.body;
    const userId = req.user.id;

    await db.query(
      "INSERT INTO watchlist (user_id, symbol, name) VALUES ($1,$2,$3)",
      [userId, symbol, name]
    );

    res.json({ message: "Added to watchlist" });

  } catch (err) {
    res.status(500).json({ message: "Failed to add to watchlist" });
  }
};

/* REMOVE FROM WATCHLIST */
exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { symbol } = req.params;

    await db.query(
      "DELETE FROM watchlist WHERE user_id=$1 AND symbol=$2",
      [userId, symbol]
    );

    res.json({ message: "Removed from watchlist" });

  } catch (err) {
    res.status(500).json({ message: "Failed to remove" });
  }
};

/* GET WATCHLIST */
exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT * FROM watchlist WHERE user_id=$1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch watchlist" });
  }
};
