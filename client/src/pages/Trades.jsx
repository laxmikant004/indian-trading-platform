import React, { useEffect, useState } from "react";
import { getTradeHistory } from "../services/tradeApi";

const Trades = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await getTradeHistory();
        setTrades(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrades();
  }, []);

  return (
    <div style={{ padding: "50px 60px", color: "white" }}>
      <h2 style={{ marginBottom: "30px" }}>
        Trade History
      </h2>

      <div
        style={{
          background: "#111827",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        {trades.length === 0 && (
          <p style={{ color: "#9ca3af" }}>
            No trades yet.
          </p>
        )}

        {trades.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ color: "#9ca3af" }}>
                <th>Type</th>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom:
                      "1px solid #1f2937",
                    height: "50px",
                  }}
                >
                  <td
                    style={{
                      color:
                        t.type === "BUY"
                          ? "#22c55e"
                          : "#ef4444",
                    }}
                  >
                    {t.type}
                  </td>
                  <td>{t.symbol}</td>
                  <td>{Number(t.quantity)}</td>
                  <td>
                    ₹{" "}
                    {Number(t.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Trades;
