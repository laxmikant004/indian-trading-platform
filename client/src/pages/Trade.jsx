import React, { useState, useEffect } from "react";
import { buyStock, sellStock } from "../services/tradeApi";
import axios from "axios";

const Trade = ({ symbol }) => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("MARKET"); // MARKET or LIMIT
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);

  const isIndex = symbol?.startsWith("^");
console.log("Trade symbol:", symbol);
 // Fetch user's balance & live price
useEffect(() => {
  if (!symbol) return;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const portfolio = await axios.get("/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBalance(portfolio.data.balance);

      const stockData = await axios.get(
        `/api/market/search/${symbol}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCurrentPrice(stockData.data.stock.price);

    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, [symbol]);

  const handleTrade = async (type) => {
    try {
      if (!symbol) return alert("No stock selected");
      if (isIndex) return alert("Indexes cannot be traded.");
      if (!quantity || quantity <= 0) return alert("Enter valid quantity");
      if (orderType !== "MARKET" && (!price || price <= 0))
        return alert("Enter a valid price for limit order");

      setLoading(true);

      const tradeData = {
        symbol,
        quantity: Number(quantity),
        price: orderType === "MARKET" ? currentPrice : Number(price),
        order_type: orderType,
        type,
      };

      if (tradeData.price * quantity > balance && type === "BUY") {
        return alert("Insufficient balance");
      }

      const apiCall = type === "BUY" ? buyStock : sellStock;
      const res = await apiCall(tradeData);
      alert(res.data.message);
      setQuantity(1);
      setPrice("");
    } catch (err) {
      alert(err.response?.data?.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  const totalValue =
    orderType === "MARKET"
      ? (currentPrice * quantity).toFixed(2)
      : (price * quantity).toFixed(2);

  return (
    <div style={{ padding: "60px", color: "white" }}>
      <div
        style={{
          background: "#111827",
          padding: "40px",
          borderRadius: "16px",
          maxWidth: "500px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Trade {symbol}</h2>

        {isIndex && (
          <p style={{ color: "#ef4444" }}>Indexes cannot be traded.</p>
        )}

        <p>Current Price: ₹{currentPrice}</p>
        <p>Available Balance: ₹{balance}</p>

        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
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

        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: "#1f2937",
            color: "white",
            border: "none",
          }}
        >
          <option value="MARKET">Market Order</option>
          <option value="LIMIT">Limit Order</option>
        </select>

        {orderType === "LIMIT" && (
          <input
            type="number"
            value={price}
            min="0"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Limit Price"
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
        )}

        <p>Total Value: ₹{totalValue}</p>

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