import React, { useEffect, useState } from "react";
import "./AdminTrades.css";
import API from "../services/api";

const AdminTrades = () => {
  const [trades, setTrades] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/admin/trades")
      .then((res) => setTrades(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = trades.filter(
    (t) =>
      t.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      t.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalVolume = filtered.reduce(
    (acc, t) => acc + Number(t.total),
    0
  );

  const buyCount = filtered.filter((t) => t.type === "BUY").length;
  const sellCount = filtered.filter((t) => t.type === "SELL").length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Trades</h1>
          <p>All executed trades across the platform</p>
        </div>

        <input
          type="text"
          placeholder="Search by symbol or user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== Stats Section ===== */}
      <div className="stats-row">
        <div className="stat-card">
          <span>Total Trades</span>
          <h2>{filtered.length}</h2>
        </div>

        <div className="stat-card">
          <span>Total Volume</span>
          <h2>₹{totalVolume.toLocaleString()}</h2>
        </div>

        <div className="stat-card">
          <span>Buy Trades</span>
          <h2 className="buy-text">{buyCount}</h2>
        </div>

        <div className="stat-card">
          <span>Sell Trades</span>
          <h2 className="sell-text">{sellCount}</h2>
        </div>
      </div>

      {/* ===== Table Section ===== */}
      <div className="card">
        <table className="trade-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((trade) => (
              <tr key={trade.id}>
                <td>{trade.id}</td>
                <td>{trade.user_name}</td>
                <td className="symbol">{trade.symbol}</td>

                <td>
                  <span
                    className={
                      trade.type === "BUY"
                        ? "badge buy"
                        : "badge sell"
                    }
                  >
                    {trade.type}
                  </span>
                </td>

                <td>{trade.quantity}</td>
                <td>₹{Number(trade.price).toLocaleString()}</td>
                <td className="total">
                  ₹{Number(trade.total).toLocaleString()}
                </td>

                <td className="date">
                  {new Date(trade.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty">No trades found</div>
        )}
      </div>
    </div>
  );
};

export default AdminTrades;