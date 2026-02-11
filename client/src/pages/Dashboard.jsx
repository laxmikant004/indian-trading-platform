import React, { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await API.get("/market");
        setMarket(res.data.market);
      } catch (error) {
        console.error("Error fetching market data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const handleAddToWatchlist = async (item) => {
    try {
      await API.post("/watchlist", {
        symbol: item.symbol,
        name: item.shortName || item.longName,
      });
      setMessage("✅ Added to watchlist");
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage("⚠️ Already in watchlist");
      } else {
        setMessage("❌ Failed to add");
      }
    }

    setTimeout(() => setMessage(""), 2000);
  };

  if (loading) {
    return <h3 className="text-center mt-4">Loading market data...</h3>;
  }

  return (
    <div className="container mt-4">
      <h2>Market Dashboard</h2>

      {message && (
        <div className="alert alert-info text-center">{message}</div>
      )}

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
            <th>% Change</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {market.map((item, index) => (
            <tr key={index}>
              {/* Symbol */}
              <td>{item.shortName || item.symbol}</td>

              {/* Price */}
              <td>{item.regularMarketPrice}</td>

              {/* Change */}
              <td
                style={{
                  color: item.regularMarketChange >= 0 ? "green" : "red",
                }}
              >
                {item.regularMarketChange.toFixed(2)}
              </td>

              {/* % Change */}
              <td
                style={{
                  color:
                    item.regularMarketChangePercent >= 0
                      ? "green"
                      : "red",
                }}
              >
                {item.regularMarketChangePercent.toFixed(2)}%
              </td>

              {/* Watchlist */}
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleAddToWatchlist(item)}
                >
                  ⭐ Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
