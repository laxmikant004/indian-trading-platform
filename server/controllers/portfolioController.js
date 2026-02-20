const db = require("../config/db");
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
});

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
    
    let holdings = holdingsResult.rows;

    /* ===============================
       FETCH LIVE PRICES
    =============================== */
    const symbols = holdings.map((h) => h.symbol);

    let quotes = [];
    if (symbols.length > 0) {
      const quotesData = await yahooFinance.quote(symbols);

      // Always convert to array
      quotes = Array.isArray(quotesData)
        ? quotesData
        : [quotesData];
    }

    /* ===============================
       MERGE LIVE DATA
    =============================== */
    holdings = holdings.map((holding) => {
      const liveData = quotes.find(q => q.symbol === holding.symbol);

      const livePrice = liveData?.regularMarketPrice || 0;

      const quantity = Number(holding.quantity);
      const avgPrice = Number(holding.avg_price);

      const invested = quantity * avgPrice;
      const current = quantity * livePrice;
      const pl = current - invested;

      return {
        ...holding,
        live_price: livePrice,
        invested_value: invested,
        current_value: current,
        unrealized_pl: pl,
        
      };
    });

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
      holdings,
      trades: tradesResult.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching portfolio" });
  }
};

module.exports = { getPortfolio };