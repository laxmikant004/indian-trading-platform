import React, { useState } from "react";
import { buyStock, sellStock } from "../services/tradeApi";

const Trade = ({ symbol }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const isIndex = symbol?.startsWith("^");

  const handleTrade = async (type) => {
    try {
      if (!symbol) return alert("No stock selected");
      if (isIndex) return alert("Indexes cannot be traded.");
      if (!quantity || quantity <= 0)
        return alert("Enter valid quantity");

      setLoading(true);

      const apiCall =
        type === "BUY" ? buyStock : sellStock;

      const res = await apiCall({
        symbol,
        quantity: Number(quantity),
      });

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "60px", color: "white" }}>
      <div
        style={{
          background: "#111827",
          padding: "40px",
          borderRadius: "16px",
          maxWidth: "450px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Trade {symbol}
        </h2>

        {isIndex && (
          <p style={{ color: "#ef4444" }}>
            Indexes cannot be traded.
          </p>
        )}

        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: "#1f2937",
            color: "white",
            border: "none",
          }}
        />

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            disabled={loading || isIndex}
            onClick={() => handleTrade("BUY")}
            style={{
              flex: 1,
              padding: "12px",
              background: "#22c55e",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Buy
          </button>

          <button
            disabled={loading || isIndex}
            onClick={() => handleTrade("SELL")}
            style={{
              flex: 1,
              padding: "12px",
              background: "#dc2626",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trade;
