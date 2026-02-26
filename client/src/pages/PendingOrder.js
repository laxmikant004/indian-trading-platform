import React, { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ quantity: "", price: "" });
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchOrders = async () => {
    const res = await API.get("/orders/pending");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const startEdit = (order) => {
    if (order.order_type === "MARKET") {
      toast.error("Market orders cannot be modified");
      return;
    }
    setEditingId(order.id);
    setEditData({ quantity: order.quantity, price: order.price });
  };

  const handleSave = async () => {
    if (editData.quantity <= 0 || editData.price <= 0) {
      toast.error("Price & Quantity must be greater than 0");
      return;
    }

    await API.put(`/orders/modify/${editingId}`, editData);
    toast.success("Order modified successfully");
    setEditingId(null);
    setShowConfirm(false);
    fetchOrders();
  };

  const cancelOrder = async (id) => {
    await API.put(`/orders/cancel/${id}`);
    toast.success("Order cancelled");
    fetchOrders();
  };

  return (
    <div style={{ padding: "40px 60px" }}>
      <h2 style={{ marginBottom: "30px", fontSize: "28px" }}>
        Pending Orders
      </h2>

      {orders.length === 0 && (
        <div style={{ opacity: 0.6 }}>No pending orders.</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              background: "#111827",
              padding: "25px",
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {/* LEFT SIDE */}
            <div>
              <div style={{ fontSize: "20px", fontWeight: "600" }}>
                {o.symbol}
              </div>

              <div style={{ marginTop: "5px", opacity: 0.7 }}>
                {o.type === "BUY" ? (
                  <span style={{ color: "#22c55e" }}>BUY</span>
                ) : (
                  <span style={{ color: "#ef4444" }}>SELL</span>
                )}
                {" • "}
                {o.order_type}
              </div>

              {editingId === o.id ? (
                <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                  <input
                    type="number"
                    value={editData.quantity}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        quantity: e.target.value
                      })
                    }
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        price: e.target.value
                      })
                    }
                    style={inputStyle}
                  />
                </div>
              ) : (
                <div style={{ marginTop: "10px", fontSize: "15px" }}>
                  Qty: {o.quantity} | ₹ {Number(o.price).toFixed(2)}
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div style={{ display: "flex", gap: "10px" }}>
              {editingId === o.id ? (
                <>
                  <button style={primaryBtn} onClick={() => setShowConfirm(true)}>
                    Save
                  </button>
                  <button
                    style={secondaryBtn}
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button style={primaryBtn} onClick={() => startEdit(o)}>
                    Modify
                  </button>
                  <button
                    style={dangerBtn}
                    onClick={() => cancelOrder(o.id)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showConfirm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Confirm Order Modification</h3>
            <p style={{ opacity: 0.7 }}>
              Are you sure you want to update this order?
            </p>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button style={primaryBtn} onClick={handleSave}>
                Yes, Save
              </button>
              <button
                style={secondaryBtn}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #374151",
  background: "#1f2937",
  color: "white"
};

const primaryBtn = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const secondaryBtn = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "1px solid #374151",
  background: "transparent",
  color: "white",
  cursor: "pointer"
};

const dangerBtn = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  background: "#dc2626",
  color: "white",
  cursor: "pointer"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalBox = {
  background: "#111827",
  padding: "30px",
  borderRadius: "12px",
  width: "400px"
};

export default PendingOrders;