import React, { useEffect, useState } from "react";
import API from "../services/api";

const AdminTrades = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    API.get("/admin/trades")
      .then(res => setTrades(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ color: "white" }}>
      <h2>Trades Management</h2>

      <ul>
        {trades.map(trade => (
          <li key={trade.id}>
            {trade.symbol} - ₹{trade.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminTrades;