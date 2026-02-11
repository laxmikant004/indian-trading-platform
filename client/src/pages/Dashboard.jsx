import React, { useEffect, useState } from "react";
import API from "../services/api";
import { buyStock, sellStock } from "../services/tradeApi";

const Dashboard = () => {
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await API.get("/market");
        setMarket(res.data.market);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching market data", error);
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // ✅ BUY
  const handleBuy = async (symbol, price) => {
    try {
      await buyStock({ symbol, quantity, price });
      alert("Stock bought successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Buy failed");
    }
  };

  // ✅ SELL
  const handleSell = async (symbol, price) => {
    try {
      await sellStock({ symbol, quantity, price });
      alert("Stock sold successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Sell failed");
    }
  };

  // ✅ ADD TO WATCHLIST
  const handleAddWatchlist = async (symbol) => {
    try {
      await API.post("/watchlist", { symbol });
      alert("Added to watchlist!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add");
    }
  };

  if (loading) {
    return <h3 className="text-center mt-4">Loading market data...</h3>;
  }

  return (
    <div className="container mt-4">
      <h2>Market Dashboard</h2>

      <div className="mb-3">
        <label>Quantity: </label>
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="form-control w-25"
        />
      </div>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
            <th>% Change</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {market.map((item, index) => (
            <tr key={index}>
              <td>{item.shortName || item.symbol}</td>

              <td>{item.regularMarketPrice}</td>

              <td
                style={{
                  color: item.regularMarketChange >= 0 ? "green" : "red",
                }}
              >
                {item.regularMarketChange.toFixed(2)}
              </td>

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

              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() =>
                    handleBuy(item.symbol, item.regularMarketPrice)
                  }
                >
                  Buy
                </button>

                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() =>
                    handleSell(item.symbol, item.regularMarketPrice)
                  }
                >
                  Sell
                </button>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleAddWatchlist(item.symbol)}
                >
                  Watchlist
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
