import React, { useState, useEffect } from "react";
import { buyStock, sellStock } from "../services/tradeApi";
import { getPortfolio } from "../services/portfolioApi";
import API from "../services/api";

const Trade = ({ symbol }) => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("MARKET");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);

  const isIndex = symbol?.startsWith("^");

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        const portfolioRes = await getPortfolio();
        setBalance(Number(portfolioRes.data?.balance ?? 0));

        const stockRes = await API.get(`/market/search/${symbol}`);
        setCurrentPrice(Number(stockRes.data?.stock?.price ?? 0));

      } catch (err) {
        console.error("Trade fetch error:", err);
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

      const tradePrice = orderType === "MARKET" ? currentPrice : Number(price);

      if (tradePrice * quantity > balance && type === "BUY") {
        return alert("Insufficient balance");
      }

      setLoading(true);

      const tradeData = {
        symbol,
        quantity: Number(quantity),
        price: tradePrice,
        order_type: orderType,
        type,
      };

      const apiCall = type === "BUY" ? buyStock : sellStock;
      const res = await apiCall(tradeData);

      alert(res.data.message);

      setQuantity(1);
      setPrice("");

      const portfolioRes = await getPortfolio();
      setBalance(Number(portfolioRes.data?.balance ?? 0));

    } catch (err) {
      alert(err.response?.data?.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  const totalValue =
    orderType === "MARKET"
      ? (currentPrice * quantity).toFixed(2)
      : (Number(price || 0) * quantity).toFixed(2);

  return (
    <div style={{ padding: "60px", color: "white" }}>
      <div style={{ background: "#111827", padding: "40px", borderRadius: "16px", maxWidth: "500px" }}>
        <h2 style={{ marginBottom: "20px" }}>Trade {symbol}</h2>

        {isIndex && <p style={{ color: "#ef4444" }}>Indexes cannot be traded.</p>}

        <p>Current Price: ₹ {currentPrice.toFixed(2)}</p>
        <p>Available Balance: ₹ {balance.toFixed(2)}</p>

        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Quantity"
          style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", background: "#1f2937", color: "white", border: "none" }}
        />

        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", background: "#1f2937", color: "white", border: "none" }}
        >
          <option value="MARKET">Market Order</option>
          <option value="LIMIT">Limit Order</option>
          <option value="STOP_LOSS">Stop Loss</option>
        </select>

        {orderType !== "MARKET" && (
          <input
            type="number"
            value={price}
            min="0"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", background: "#1f2937", color: "white", border: "none" }}
          />
        )}

        <p>Total Value: ₹ {totalValue}</p>

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            disabled={loading || isIndex}
            onClick={() => handleTrade("BUY")}
            style={{ flex: 1, padding: "12px", background: "#22c55e", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            {loading ? "Processing..." : "Buy"}
          </button>

          <button
            disabled={loading || isIndex}
            onClick={() => handleTrade("SELL")}
            style={{ flex: 1, padding: "12px", background: "#dc2626", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            {loading ? "Processing..." : "Sell"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trade;