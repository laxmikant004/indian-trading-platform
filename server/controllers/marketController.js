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

    const data = await Promise.all(
      symbols.map((symbol) => yahooFinance.quote(symbol))
    );

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
      .filter(
        (q) =>
          q.symbol?.includes(".NS") ||
          q.symbol?.includes(".BO") ||
          q.symbol?.startsWith("^")
      )
      .slice(0, 8)
      .map((stock) => ({
        symbol: stock.symbol,
        name: stock.shortname || stock.longname,
      }));

    res.json(filtered);
  } catch (error) {
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

    const data = await Promise.all(
      symbols.map((s) => yahooFinance.quote(s))
    );

    const sorted = data.sort(
      (a, b) =>
        b.regularMarketChangePercent -
        a.regularMarketChangePercent
    );

    res.json({
      gainers: sorted.slice(0, 3),
      losers: sorted.slice(-3),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movers" });
  }
};