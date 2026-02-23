import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import API from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [trades, setTrades] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await API.get("/admin/users");
        const tradesRes = await API.get("/admin/trades");
        const ordersRes = await API.get("/admin/orders");

        setUsers(usersRes.data);
        setTrades(tradesRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, []);

  const pendingOrders = orders.filter(
    (o) => o.status === "PENDING"
  ).length;

  const executedOrders = orders.filter(
    (o) => o.status === "EXECUTED"
  ).length;

  const totalVolume = trades.reduce(
    (acc, t) => acc + Number(t.total || 0),
    0
  );

  const barData = {
    labels: ["Users", "Trades", "Pending", "Executed"],
    datasets: [
      {
        label: "Platform Stats",
        data: [
          users.length,
          trades.length,
          pendingOrders,
          executedOrders,
        ],
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#10b981",
        ],
      },
    ],
  };

  const doughnutData = {
    labels: ["Pending Orders", "Executed Orders"],
    datasets: [
      {
        data: [pendingOrders, executedOrders],
        backgroundColor: ["#f59e0b", "#22c55e"],
      },
    ],
  };

  return (
    <div>
      {/* Page Title */}
      <h1 style={{ marginBottom: "30px" }}>
        Platform Overview
      </h1>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <Card title="Total Users" value={users.length} />
        <Card title="Total Trades" value={trades.length} />
        <Card title="Pending Orders" value={pendingOrders} />
        <Card
          title="Total Volume"
          value={`₹ ${totalVolume.toFixed(2)}`}
        />
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>
            Platform Statistics
          </h3>
          <Bar data={barData} />
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>
            Order Distribution
          </h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div
    style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 0 15px rgba(0,0,0,0.3)",
    }}
  >
    <h4 style={{ opacity: 0.7 }}>{title}</h4>
    <h2 style={{ marginTop: "10px" }}>{value}</h2>
  </div>
);

export default AdminDashboard;