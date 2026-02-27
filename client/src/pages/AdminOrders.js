import React, { useEffect, useState } from "react";
import "./AdminOrders.css";
import API from "../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/admin/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      o.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = filtered.filter((o) => o.status === "PENDING").length;
  const executedCount = filtered.filter((o) => o.status === "EXECUTED").length;
  const cancelledCount = filtered.filter((o) => o.status === "CANCELLED").length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>All orders placed on the platform</p>
        </div>

        <input
          type="text"
          placeholder="Search by symbol or user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== Stats Section ===== */}
      <div className="stats-row">
        <div className="stat-card">
          <span>Total Orders</span>
          <h2>{filtered.length}</h2>
        </div>

        <div className="stat-card">
          <span>Pending</span>
          <h2 className="pending-text">{pendingCount}</h2>
        </div>

        <div className="stat-card">
          <span>Executed</span>
          <h2 className="executed-text">{executedCount}</h2>
        </div>

        <div className="stat-card">
          <span>Cancelled</span>
          <h2 className="cancelled-text">{cancelledCount}</h2>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="card">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Order Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_name}</td>
                <td className="symbol">{order.symbol}</td>

                <td>
                  <span
                    className={
                      order.type === "BUY"
                        ? "badge buy"
                        : "badge sell"
                    }
                  >
                    {order.type}
                  </span>
                </td>

                <td>
                  <span className="order-type">
                    {order.order_type}
                  </span>
                </td>

                <td>{order.quantity}</td>

                <td>
                  {order.price
                    ? `₹${Number(order.price).toLocaleString()}`
                    : "-"}
                </td>

                <td>
                  <span
                    className={`status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="date">
                  {new Date(order.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;