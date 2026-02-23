import React, { useEffect, useState } from "react";
import API from "../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/admin/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ color: "white" }}>
      <h2>Orders Management</h2>

      <ul>
        {orders.map(order => (
          <li key={order.id}>
            {order.symbol} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrders;