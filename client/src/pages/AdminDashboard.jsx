import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [trades, setTrades] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    fetchTrades();
    fetchOrders();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const fetchTrades = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/trades", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTrades(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  const cardStyle = {
    background: "#111827",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 0 20px rgba(0,255,200,0.05)",
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h2 style={{ marginBottom: "30px" }}>Admin Dashboard</h2>

      {/* ================= SUMMARY CARDS ================= */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        <div style={cardStyle}>
          <h4>Total Users</h4>
          <h2>{users.length}</h2>
        </div>
        <div style={cardStyle}>
          <h4>Total Trades</h4>
          <h2>{trades.length}</h2>
        </div>
        <div style={cardStyle}>
          <h4>Pending Orders</h4>
          <h2>{orders.filter(o => o.status === "PENDING").length}</h2>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("trades")}>Trades</button>
        <button onClick={() => setActiveTab("orders")}>Orders</button>
      </div>

      {/* ================= USERS ================= */}
      {activeTab === "users" && (
        <div style={cardStyle}>
          <h3>All Users</h3>
          <table width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TRADES ================= */}
      {activeTab === "trades" && (
        <div style={cardStyle}>
          <h3>All Trades</h3>
          <table width="100%">
            <thead>
              <tr>
                <th>User</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id}>
                  <td>{t.user_id}</td>
                  <td>{t.symbol}</td>
                  <td>{t.type}</td>
                  <td>{t.quantity}</td>
                  <td>₹ {t.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ORDERS ================= */}
      {activeTab === "orders" && (
        <div style={cardStyle}>
          <h3>All Orders</h3>
          <table width="100%">
            <thead>
              <tr>
                <th>User</th>
                <th>Symbol</th>
                <th>Order Type</th>
                <th>Side</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.user_id}</td>
                  <td>{o.symbol}</td>
                  <td>{o.order_type}</td>
                  <td>{o.type}</td>
                  <td>{o.quantity}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;