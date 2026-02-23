import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #334155",
        color: "white",
      }}
    >
      <h3>Admin Dashboard</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        
        {/* System Status */}
        <span style={{ color: "#22c55e", fontWeight: "600" }}>
          ● Market Open
        </span>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
          </span>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "30px",
                background: "#111827",
                padding: "15px",
                borderRadius: "8px",
                width: "250px",
                boxShadow: "0 0 15px rgba(0,0,0,0.4)",
              }}
            >
              <p>No new notifications</p>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: "relative" }} ref={profileRef}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {initials}
          </div>

          {showProfile && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "45px",
                background: "#111827",
                padding: "15px",
                borderRadius: "8px",
                width: "200px",
                boxShadow: "0 0 15px rgba(0,0,0,0.4)",
              }}
            >
              <p style={{ marginBottom: "10px" }}>{user?.email}</p>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  background: "#ef4444",
                  border: "none",
                  padding: "8px",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;