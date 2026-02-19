import React, { useEffect, useState } from "react";
import { getPortfolio } from "../services/portfolioApi";

const Portfolio = ({ openTrade }) => {
  const [data, setData] = useState({
    balance: 0,
    holdings: [],
    trades: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPortfolio();

        setData({
          balance: Number(res.data?.balance ?? 0),
          holdings: res.data?.holdings ?? [],
          trades: res.data?.trades ?? [],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "#0b1220",
        minHeight: "100vh",
        padding: "50px 60px",
        color: "white",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Portfolio</h2>

      {/* ================= BALANCE ================= */}
      <div
        style={{
          background: "#111827",
          padding: "25px",
          borderRadius: "16px",
          marginBottom: "40px",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Available Balance</h3>
        <h1 style={{ color: "#22c55e", fontSize: "32px" }}>
          ₹ {Number(data.balance).toFixed(2)}
        </h1>
      </div>

      {/* ================= HOLDINGS ================= */}
      <div
        style={{
          background: "#111827",
          padding: "25px",
          borderRadius: "16px",
          marginBottom: "40px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>Your Holdings</h3>

        {data.holdings.length === 0 && (
          <p style={{ color: "#9ca3af" }}>No holdings yet.</p>
        )}

        {data.holdings.map((h, i) => {
          const quantity = Number(h.quantity || 0);
          const avgPrice = Number(h.avg_price || 0);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 0",
                borderBottom: "1px solid #1f2937",
              }}
            >
              {/* LEFT SIDE */}
              <div>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {h.symbol}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#9ca3af",
                    marginTop: "4px",
                  }}
                >
                  Qty: {quantity} | Avg Price: ₹{" "}
                  {avgPrice.toFixed(2)}
                </div>
              </div>

              {/* RIGHT SIDE BUTTON */}
              <button
                onClick={() =>
                  openTrade && openTrade(h.symbol)
                }
                style={{
                  background: "#2563eb",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: "white",
                  width: "120px",
                  height: "36px",
                }}
              >
                Buy / Sell
              </button>
            </div>
          );
        })}
      </div>

      {/* ================= TRADE HISTORY ================= */}
      <div
        style={{
          background: "#111827",
          padding: "25px",
          borderRadius: "16px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>
          Recent Trades
        </h3>

        {data.trades.length === 0 && (
          <p style={{ color: "#9ca3af" }}>
            No trades yet.
          </p>
        )}

        {data.trades.map((t, i) => {
          const price = Number(t.price || 0);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #1f2937",
              }}
            >
              <span>{t.symbol}</span>

              <span
                style={{
                  color:
                    t.type === "BUY"
                      ? "#22c55e"
                      : "#ef4444",
                }}
              >
                {t.type}
              </span>

              <span>Qty: {t.quantity}</span>

              <span>
                ₹ {price.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;
