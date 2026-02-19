const db = require("../config/db");

const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    /* ===============================
       GET USER BALANCE
    =============================== */
    const balanceResult = await db.query(
      "SELECT balance FROM portfolios WHERE user_id = $1",
      [userId]
    );

    /* ===============================
       GET HOLDINGS (Weighted Average)
    =============================== */
    const holdingsResult = await db.query(
      `
      SELECT 
        symbol,
        SUM(
          CASE 
            WHEN type = 'BUY' THEN quantity 
            ELSE -quantity 
          END
        ) AS quantity,

        -- Weighted average price
        (
          SUM(
            CASE 
              WHEN type = 'BUY' THEN price * quantity
              ELSE 0
            END
          ) 
          /
          NULLIF(
            SUM(
              CASE 
                WHEN type = 'BUY' THEN quantity
                ELSE 0
              END
            ), 0
          )
        )::float AS avg_price

      FROM trades
      WHERE user_id = $1
      GROUP BY symbol
      HAVING SUM(
        CASE 
          WHEN type = 'BUY' THEN quantity 
          ELSE -quantity 
        END
      ) > 0
      `,
      [userId]
    );

    /* ===============================
       GET TRADES
    =============================== */
    const tradesResult = await db.query(
      `
      SELECT symbol, type, quantity, price::float, created_at
      FROM trades
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json({
      balance: Number(balanceResult.rows[0]?.balance || 0),
      holdings: holdingsResult.rows,
      trades: tradesResult.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching portfolio" });
  }
};

module.exports = { getPortfolio };
