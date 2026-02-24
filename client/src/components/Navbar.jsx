import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#22c55e" : "#cbd5e1",
    fontWeight: location.pathname === path ? 700 : 500,
    fontSize: "16px", // bigger text
    transition: "color 0.2s, transform 0.2s",
  });

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
          fontWeight: 700,
          letterSpacing: "1px",
          color: "#f8fafc",
          display: "flex",
          alignItems: "center",
          gap: "15px", // more space between image & text
          fontSize: "28px", // bigger text
        }}
      >
        <img src="/unnamed.png" alt="Logo" style={{ height: "70px" }} />
        Indian Stock Trading Platform
      </h2>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        {isAdmin && (
          <>
            <Link
              to="/admin"
              style={linkStyle("/admin")}
              onMouseEnter={(e) => (e.target.style.color = "#22c55e")}
              onMouseLeave={(e) =>
                (e.target.style.color =
                  location.pathname === "/admin" ? "#22c55e" : "#cbd5e1")
              }
            >
              Admin Panel
            </Link>
            <Link
              to="/admin/users"
              style={linkStyle("/admin/users")}
              onMouseEnter={(e) => (e.target.style.color = "#22c55e")}
              onMouseLeave={(e) =>
                (e.target.style.color =
                  location.pathname === "/admin/users"
                    ? "#22c55e"
                    : "#cbd5e1")
              }
            >
              Users
            </Link>
            <Link
              to="/admin/orders"
              style={linkStyle("/admin/orders")}
              onMouseEnter={(e) => (e.target.style.color = "#22c55e")}
              onMouseLeave={(e) =>
                (e.target.style.color =
                  location.pathname === "/admin/orders"
                    ? "#22c55e"
                    : "#cbd5e1")
              }
            >
              Orders
            </Link>
            <Link
              to="/admin/trades"
              style={linkStyle("/admin/trades")}
              onMouseEnter={(e) => (e.target.style.color = "#22c55e")}
              onMouseLeave={(e) =>
                (e.target.style.color =
                  location.pathname === "/admin/trades"
                    ? "#22c55e"
                    : "#cbd5e1")
              }
            >
              Trades
            </Link>
          </>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #ef4444",
            color: "#ef4444",
            padding: "8px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#ef4444";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#ef4444";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;