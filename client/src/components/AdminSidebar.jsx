import { NavLink } from "react-router-dom";
import { useState } from "react";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 15px",
    marginBottom: "10px",
    borderRadius: "8px",
    textDecoration: "none",
    background: isActive ? "#1e293b" : "transparent",
    color: "white",
    fontWeight: isActive ? "600" : "400",
    transition: "0.2s",
  });

  return (
    <div
      style={{
        width: collapsed ? "80px" : "240px",
        background: "#111827",
        padding: "20px",
        transition: "0.3s",
        borderRight: "1px solid #1f2937",
        minHeight: "100vh",
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          marginBottom: "30px",
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        ☰
      </button>

      {/* Links */}
      <NavLink to="/admin" end style={linkStyle}>
        <span>📊</span>
        {!collapsed && <span>Dashboard</span>}
      </NavLink>

      <NavLink to="/admin/users" style={linkStyle}>
        <span>👥</span>
        {!collapsed && <span>Users</span>}
      </NavLink>

      <NavLink to="/admin/orders" style={linkStyle}>
        <span>📦</span>
        {!collapsed && <span>Orders</span>}
      </NavLink>

      <NavLink to="/admin/trades" style={linkStyle}>
        <span>💹</span>
        {!collapsed && <span>Trades</span>}
      </NavLink>

      <NavLink to="/admin/analytics" style={linkStyle}>
        <span>📈</span>
        {!collapsed && <span>Analytics</span>}
      </NavLink>
    </div>
  );
};

export default AdminSidebar;