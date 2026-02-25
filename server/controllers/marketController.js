const YahooFinance = require("yahoo-finance2").default;

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"],
});

/* ================= MARKET OVERVIEW ================= */
exports.getMarketData = async (req, res) => {
  try {
    const symbols = [
      "^NSEI",
      "^BSESN",
      "RELIANCE.NS",
      "TCS.NS",
      "INFY.NS",
      "HDFCBANK.NS",
      "ICICIBANK.NS",
      "SBIN.NS",
      "ITC.NS",
      "LT.NS",
      "HINDUNILVR.NS",
      "BHARTIARTL.NS",
    ];

    const data = [];

    // Fetch one-by-one to avoid timeout
    for (const symbol of symbols) {
      try {
        const quote = await yahooFinance.quote(symbol);
        data.push(quote);
      } catch (err) {
        console.log("Failed symbol:", symbol);
      }
    }

    res.json({ market: data });
  } catch (error) {
    console.error("MARKET ERROR:", error);
    res.status(500).json({ message: "Failed to fetch market data" });
  }
};

/* ================= SEARCH STOCK ================= */
exports.searchStock = async (req, res) => {
  try {
    let symbol = req.params.symbol;

    if (!symbol) {
      return res.status(400).json({ message: "Symbol required" });
    }

    symbol = symbol.toUpperCase();

    // Auto index mapping
    const indexMap = {
      BANKNIFTY: "^NSEBANK",
      NIFTY: "^NSEI",
      SENSEX: "^BSESN",
    };

    if (indexMap[symbol]) {
      symbol = indexMap[symbol];
    }

    if (!symbol.startsWith("^") && !symbol.includes(".")) {
      symbol += ".NS";
    }

    const stock = await yahooFinance.quote(symbol);

    res.json({
      stock: {
        symbol: stock.symbol,
        shortName: stock.shortName,
        price: stock.regularMarketPrice,
        change: stock.regularMarketChangePercent,
      },
    });
  } catch (error) {
    console.log("SEARCH ERROR:", error.message);
    res.status(404).json({ message: "Stock not found" });
  }
};

/* ================= AUTO SUGGESTIONS ================= */
exports.searchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const result = await yahooFinance.search(query);

    const filtered = result.quotes
      ?.filter(
        (q) =>
          q.symbol?.includes(".NS") ||
          q.symbol?.includes(".BO") ||
          q.symbol?.startsWith("^")
      )
      .slice(0, 8)
      .map((stock) => ({
        symbol: stock.symbol,
        name: stock.shortname || stock.longname,
      })) || [];

    res.json(filtered);
  } catch (error) {
    console.log("SUGGESTION ERROR:", error.message);
    res.status(500).json({ message: "Search failed" });
  }
};

/* ================= TOP GAINERS & LOSERS ================= */
exports.getTopMovers = async (req, res) => {
  try {
    const symbols = [
      "RELIANCE.NS",
      "TCS.NS",
      "INFY.NS",
      "HDFCBANK.NS",
      "ICICIBANK.NS",
      "SBIN.NS",
    ];

    const data = [];

    for (const symbol of symbols) {
      try {
        const quote = await yahooFinance.quote(symbol);
        data.push(quote);
      } catch (err) {
        console.log("Failed mover:", symbol);
      }
    }

    const sorted = data.sort(
      (a, b) =>
        (b.regularMarketChangePercent || 0) -
        (a.regularMarketChangePercent || 0)
    );

    res.json({
      gainers: sorted.slice(0, 3),
      losers: sorted.slice(-3),
    });
  } catch (err) {
    console.error("MOVERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch movers" });
  }
};