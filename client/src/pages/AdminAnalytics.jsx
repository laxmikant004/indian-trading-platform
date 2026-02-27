import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import API from "../services/api";

const AdminAnalytics = () => {
  const [range, setRange] = useState("7");
  const [summary, setSummary] = useState({
    totalTrades: 0,
    totalRevenue: 0,
    growth: 0,
    avgTrades: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/admin/analytics?range=${range}`);

        setSummary(
          res.data.summary || {
            totalTrades: 0,
            totalRevenue: 0,
            growth: 0,
            avgTrades: 0,
          }
        );

        setChartData(res.data.chartData || []);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h2>Analytics Dashboard</h2>

        <div>
          <button
            style={range === "7" ? styles.activeBtn : styles.filterBtn}
            onClick={() => setRange("7")}
          >
            Last 7 Days
          </button>

          <button
            style={range === "30" ? styles.activeBtn : styles.filterBtn}
            onClick={() => setRange("30")}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading analytics...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={styles.cardGrid}>
            <div style={styles.kpiCard}>
              <span>Total Trades</span>
              <h3>{summary.totalTrades}</h3>
            </div>

            <div style={styles.kpiCard}>
              <span>Total Revenue</span>
              <h3>₹{Number(summary.totalRevenue).toLocaleString()}</h3>
            </div>

            <div style={styles.kpiCard}>
              <span>Growth</span>
              <h3
                style={{
                  color: summary.growth >= 0 ? "#22c55e" : "#ef4444",
                }}
              >
                {summary.growth}%
              </h3>
            </div>

            <div style={styles.kpiCard}>
              <span>Avg Trades / Day</span>
              <h3>{summary.avgTrades}</h3>
            </div>
          </div>

          {/* Charts */}
          <div style={styles.chartGrid}>
            {/* Trades Chart */}
            <div style={styles.chartCard}>
              <h4 style={styles.chartTitle}>Trades Volume</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1f2937" />
                  <XAxis dataKey="label" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="trades"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Chart */}
            <div style={styles.chartCard}>
              <h4 style={styles.chartTitle}>Revenue</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid stroke="#1f2937" />
                  <XAxis dataKey="label" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "30px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  filterBtn: {
    background: "#1e293b",
    color: "#cbd5e1",
    border: "1px solid #334155",
    padding: "8px 14px",
    borderRadius: "8px",
    marginLeft: "10px",
    cursor: "pointer",
  },
  activeBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    marginLeft: "10px",
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  kpiCard: {
    background: "#111827",
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid #1f2937",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px",
  },
  chartCard: {
    background: "#111827",
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid #1f2937",
  },
  chartTitle: {
    marginBottom: "15px",
    fontWeight: "500",
    color: "#cbd5e1",
  },
  loading: {
    padding: "40px",
    textAlign: "center",
    fontSize: "18px",
  },
};

export default AdminAnalytics;