import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#22c55e" : "#cbd5e1",
    fontWeight: location.pathname === path ? "700" : "500",
    fontSize: "14px",
    transition: "0.2s",
  });

  const isAdmin = user?.role === "ADMIN";

  return (
    <nav
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(12px)",
        padding: "16px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        borderBottom: "1px solid #1f2937",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <h2
        onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
        style={{
          margin: 0,
          cursor: "pointer",
          fontWeight: "600",
          letterSpacing: "1px",
          color: "#f8fafc",
        }}
      >
        📈 Indian Stock Trading Platform
      </h2>

      <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        {!isAdmin && (
          <>
            <Link to="/dashboard" style={linkStyle("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/portfolio" style={linkStyle("/portfolio")}>
              Portfolio
            </Link>
            <Link to="/trades" style={linkStyle("/trades")}>
              Trades
            </Link>
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/admin" style={linkStyle("/admin")}>
              Admin Panel
            </Link>
            <Link to="/admin/users" style={linkStyle("/admin/users")}>
              Users
            </Link>
            <Link to="/admin/orders" style={linkStyle("/admin/orders")}>
              Orders
            </Link>
            <Link to="/admin/trades" style={linkStyle("/admin/trades")}>
              Trades
            </Link>
          </>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #ef4444",
            color: "#ef4444",
            padding: "6px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;