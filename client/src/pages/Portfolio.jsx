import React, { useEffect, useState } from "react";
import { getPortfolio } from "../services/portfolioApi";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#00C49F",
  "#0088FE",
  "#FFBB28",
  "#FF8042",
  "#A28CFF",
  "#FF4C4C",
];

const Portfolio = ({ openTrade }) => {
  const [data, setData] = useState({
    balance: 0,
    holdings: [],
    trades: [],
    totalInvested: 0,
    totalCurrentValue: 0,
    totalPnl: 0,
    profitPercent: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPortfolio();
        const holdings = res.data?.holdings ?? [];

        const totalInvested = holdings.reduce(
          (acc, h) => acc + Number(h.invested_value || 0),
          0,
        );

        const totalCurrentValue = holdings.reduce(
          (acc, h) => acc + Number(h.current_value || 0),
          0,
        );

        const totalPnl = totalCurrentValue - totalInvested;

        const profitPercent =
          totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

        setData({
          balance: Number(res.data?.balance ?? 0),
          holdings,
          trades: res.data?.trades ?? [],
          totalInvested,
          totalCurrentValue,
          totalPnl,
          profitPercent,
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

      {/* ================= SUMMARY CARDS ================= */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <SummaryCard
          title="Available Balance"
          value={`₹ ${data.balance.toFixed(2)}`}
          color="#22c55e"
        />

        <SummaryCard
          title="Total Portfolio Value"
          value={`₹ ${data.totalCurrentValue.toFixed(2)}`}
        />

        <SummaryCard
          title="Total Profit / Loss"
          value={`₹ ${data.totalPnl.toFixed(2)}`}
          color={data.totalPnl >= 0 ? "#22c55e" : "#ef4444"}
          sub={`${data.profitPercent.toFixed(2)}%`}
        />
      </div>
      {/* ================= PORTFOLIO ALLOCATION ================= */}
      {data.holdings.length > 0 && (
        <div
          style={{
            background: "#111827",
            padding: "30px",
            borderRadius: "20px",
            marginBottom: "40px",
            boxShadow: "0 0 30px rgba(0,255,200,0.05)",
          }}
        >
          <h3 style={{ marginBottom: "25px" }}>Portfolio Allocation</h3>

          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data.holdings}
                dataKey="current_value"
                nameKey="symbol"
                cx="50%"
                cy="50%"
                outerRadius={150}
                innerRadius={80}
                paddingAngle={4}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.holdings.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                }}
                formatter={(value) => `₹ ${Number(value).toFixed(2)}`}
              />

              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ================= HOLDINGS ================= */}
      <Card title="Your Holdings">
        {data.holdings.length === 0 && (
          <p style={{ color: "#9ca3af" }}>No holdings yet.</p>
        )}

        {data.holdings.map((h, i) => (
          <div
            key={i}
            style={{
              padding: "15px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                  {h.symbol}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#9ca3af",
                    marginTop: "4px",
                  }}
                >
                  Qty: {h.quantity} | Avg: ₹ {Number(h.avg_price).toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => openTrade && openTrade(h.symbol)}
                style={buttonStyle}
              >
                Buy / Sell
              </button>
            </div>

            <div
              style={{
                marginTop: "10px",
                fontSize: "13px",
                color: "#9ca3af",
              }}
            >
              Live: ₹ {Number(h.live_price).toFixed(2)} | Invested: ₹{" "}
              {Number(h.invested_value).toFixed(2)} | Current: ₹{" "}
              {Number(h.current_value).toFixed(2)}
            </div>

            <div
              style={{
                marginTop: "5px",
                fontWeight: "bold",
                color: h.unrealized_pl >= 0 ? "#22c55e" : "#ef4444",
              }}
            >
              Unrealized P/L: ₹ {Number(h.unrealized_pl).toFixed(2)}
            </div>
          </div>
        ))}
      </Card>

      {/* ================= RECENT TRADES ================= */}
      <Card title="Recent Trades">
        {data.trades.length === 0 && (
          <p style={{ color: "#9ca3af" }}>No trades yet.</p>
        )}

        {data.trades.length > 0 && (
          <>
            {/* Header Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                color: "#9ca3af",
                fontSize: "13px",
                marginBottom: "10px",
              }}
            >
              <div>Symbol</div>
              <div style={{ textAlign: "center" }}>Type</div>
              <div style={{ textAlign: "right" }}>Qty</div>
              <div style={{ textAlign: "right" }}>Price</div>
            </div>

            {/* Trade Rows */}
            {data.trades.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div>{t.symbol}</div>

                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background:
                        t.type === "BUY"
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(239,68,68,0.15)",
                      color: t.type === "BUY" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {t.type}
                  </span>
                </div>

                <div style={{ textAlign: "right" }}>Qty: {t.quantity}</div>

                <div style={{ textAlign: "right" }}>
                  ₹ {Number(t.price).toFixed(2)}
                </div>
              </div>
            ))}
          </>
        )}
      </Card>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const SummaryCard = ({ title, value, color, sub }) => (
  <div
    style={{
      background: "#111827",
      padding: "25px",
      borderRadius: "20px",
      flex: "1",
      minWidth: "220px",
      boxShadow: "0 0 20px rgba(0,255,200,0.04)",
    }}
  >
    <h4 style={{ color: "#9ca3af" }}>{title}</h4>
    <h2 style={{ color: color || "white" }}>{value}</h2>
    {sub && (
      <div
        style={{
          color: color || "white",
          fontSize: "14px",
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

const Card = ({ title, children }) => (
  <div
    style={{
      background: "#111827",
      padding: "25px",
      borderRadius: "20px",
      marginBottom: "40px",
    }}
  >
    <h3 style={{ marginBottom: "20px" }}>{title}</h3>
    {children}
  </div>
);

const buttonStyle = {
  background: "#2563eb",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  color: "white",
  height: "36px",
};

export default Portfolio;
