import React, { useState, useEffect } from "react";
import API from "../services/api";
import Portfolio from "./Portfolio";
import Trades from "./Trades";
import Trade from "./Trade";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("market");
  const [tradeSymbol, setTradeSymbol] = useState(null);

  const [market, setMarket] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  // 🔎 SEARCH STATES
  const [symbol, setSymbol] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= POLLING =================
  useEffect(() => {
    fetchMarket();
    fetchWatchlist();

    const marketInterval = setInterval(fetchMarket, 15000);
    const watchlistInterval = setInterval(fetchWatchlist, 15000);

    return () => {
      clearInterval(marketInterval);
      clearInterval(watchlistInterval);
    };
  }, []);

  // ================= API =================
  const fetchMarket = async () => {
    try {
      const res = await API.get("/market");
      setMarket(res.data?.market ?? []);
    } catch (err) {
      console.error("Market fetch failed:", err);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const res = await API.get("/watchlist");
      setWatchlist(res.data ?? []);
    } catch (err) {
      console.error("Watchlist fetch failed:", err);
    }
  };

  const handleAddWatchlist = async (stock) => {
    try {
      await API.post("/watchlist", {
        symbol: stock.symbol,
        name: stock.shortName || stock.name || stock.symbol,
      });
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveWatchlist = async (symbol) => {
    try {
      await API.delete(`/watchlist/${symbol}`);
      fetchWatchlist();
    } catch (err) {
      console.error(err);
    }
  };

  const openTrade = (symbol) => {
    setTradeSymbol(symbol);
    setActiveTab("trade");
  };

  const isInWatchlist = (symbol) =>
    watchlist.some((s) => s.symbol === symbol);

  // ================= SEARCH =================
  const handleSearch = async () => {
    if (!symbol) return;

    try {
      setLoading(true);
      const res = await API.get(`/market/${symbol}`);
      setSearchData(res.data?.stock ?? null);
      setError("");
      setShowDropdown(false);
    } catch {
      setSearchData(null);
      setError("Stock not found");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (value) => {
    if (value.length < 2) return setSuggestions([]);

    try {
      const res = await API.get(`/market/suggestions?query=${value}`);
      setSuggestions(res.data ?? []);
      setShowDropdown(true);
    } catch {
      setSuggestions([]);
    }
  };

  // ================= STYLES =================
  const card = {
    background: "linear-gradient(145deg, #111827, #0f172a)",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  };

  const btnBlue = {
    background: "#2563eb",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
  };

  const btnGreen = {
    background: "#16a34a",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
  };

  const btnRed = {
    background: "#dc2626",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
  };

  // ================= RENDER =================
  const renderContent = () => {
    switch (activeTab) {
      case "market":
        return (
          <>
            {/* 🔎 SEARCH */}
            <div style={{ position: "relative", width: "320px" }}>
              <input
                value={symbol}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setSymbol(val);
                  fetchSuggestions(val);
                }}
                placeholder="Search stock (TCS, INFY...)"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #1f2937",
                  background: "#0f172a",
                  color: "white",
                }}
              />

              {showDropdown && suggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "52px",
                    width: "100%",
                    background: "#111827",
                    borderRadius: "12px",
                    zIndex: 1000,
                  }}
                >
                  {suggestions.map((item) => (
                    <div
                      key={item.symbol}
                      style={{
                        padding: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #1f2937",
                      }}
                    >
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSymbol(item.symbol);
                          setShowDropdown(false);
                        }}
                      >
                        {item.name}
                      </span>

                      {!isInWatchlist(item.symbol) && (
                        <button
                          onClick={() => handleAddWatchlist(item)}
                          style={btnGreen}
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleSearch}
                style={{ ...btnGreen, marginTop: "10px", width: "100%" }}
              >
                {loading ? "Searching..." : "Search"}
              </button>

              {error && <p style={{ color: "#ef4444" }}>{error}</p>}
            </div>

            {/* SEARCH RESULT */}
            {searchData && (
              <div style={{ ...card, marginTop: "30px", width: "350px" }}>
                <h3>{searchData.shortName || searchData.symbol}</h3>
                <h1>₹ {searchData.price}</h1>
                <p
                  style={{
                    color:
                      searchData.change >= 0 ? "#22c55e" : "#ef4444",
                  }}
                >
                  {searchData.change?.toFixed(2)}%
                </p>

                <button
                  onClick={() => openTrade(searchData.symbol)}
                  style={{ ...btnBlue, marginTop: "10px", width: "100%" }}
                >
                  Buy / Sell
                </button>
              </div>
            )}

            {/* MARKET + WATCHLIST */}
            <div style={{ display: "flex", gap: "40px", marginTop: "50px" }}>
              {/* MARKET */}
              <div style={{ ...card, flex: 3 }}>
                <h3>📈 Market Overview</h3>
                <table style={{ width: "100%", marginTop: "20px" }}>
                  <thead style={{ color: "#9ca3af" }}>
                    <tr>
                      <th align="left">Stock</th>
                      <th align="left">Price</th>
                      <th align="left">%</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {market.map((item, i) => {
                      const isIndex = item.symbol?.startsWith("^");

                      return (
                        <tr key={i} style={{ height: "60px" }}>
                          <td>{item.shortName || item.symbol}</td>
                          <td>
                            ₹ {Number(item.regularMarketPrice ?? 0).toFixed(2)}
                          </td>
                          <td
                            style={{
                              color:
                                Number(
                                  item.regularMarketChangePercent ?? 0
                                ) >= 0
                                  ? "#22c55e"
                                  : "#ef4444",
                            }}
                          >
                            {Number(
                              item.regularMarketChangePercent ?? 0
                            ).toFixed(2)}
                            %
                          </td>
                          <td>
                            {!isIndex && (
                              <>
                                <button
                                  onClick={() => openTrade(item.symbol)}
                                  style={btnBlue}
                                >
                                  Buy/Sell
                                </button>

                                {!isInWatchlist(item.symbol) && (
                                  <button
                                    onClick={() =>
                                      handleAddWatchlist(item)
                                    }
                                    style={{ ...btnGreen, marginLeft: "8px" }}
                                  >
                                    + Watchlist
                                  </button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* WATCHLIST */}
              <div style={{ ...card, flex: 1 }}>
                <h3>⭐ Watchlist</h3>

                {watchlist.length === 0 && (
                  <p style={{ color: "#9ca3af" }}>
                    No stocks added yet.
                  </p>
                )}

                {watchlist.map((s) => (
                  <div
                    key={s.symbol}
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div>{s.name}</div>
                      <small style={{ color: "#9ca3af" }}>
                        {s.symbol}
                      </small>
                    </div>

                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => openTrade(s.symbol)}
                        style={btnBlue}
                      >
                        Buy/Sell
                      </button>
                      <button
                        onClick={() =>
                          handleRemoveWatchlist(s.symbol)
                        }
                        style={btnRed}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case "portfolio":
        return <Portfolio openTrade={openTrade} />;

      case "trades":
        return <Trades />;

      case "trade":
        return tradeSymbol ? (
          <Trade symbol={tradeSymbol} />
        ) : (
          <p>Select a stock first</p>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "white" }}>
      <div
        style={{
          display: "flex",
          padding: "20px 40px",
          gap: "20px",
          background: "#111827",
        }}
      >
        {["market", "portfolio", "trades", "trade"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              background:
                activeTab === tab ? "#22c55e" : "#1f2937",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ padding: "40px 60px" }}>{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
