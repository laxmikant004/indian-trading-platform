const YahooFinance = require("yahoo-finance2").default;

// CREATE INSTANCE 👇 (this is what error is asking for)
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
});


exports.getMarketData = async (req, res) => {
  try {
    const symbols = [
      "^NSEI",     // NIFTY 50
      "^BSESN",    // SENSEX
      "RELIANCE.NS",
      "TCS.NS",
      "INFY.NS"
    ];

    const data = await Promise.all(
      symbols.map(symbol => yahooFinance.quote(symbol))
    );

    res.json({
      success: true,
      market: data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch market data" });
  }
};
