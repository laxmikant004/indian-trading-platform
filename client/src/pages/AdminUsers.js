import React, { useEffect, useState, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const changeRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const blockUser = async (id) => {
    await API.put(`/admin/users/${id}/block`);
    toast.success("User blocked");
    fetchUsers();
  };

  const unblockUser = async (id) => {
    await API.put(`/admin/users/${id}/unblock`);
    toast.success("User unblocked");
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await API.delete(`/admin/users/${id}`);
    toast.success("User deleted");
    fetchUsers();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ fontSize: "26px", marginBottom: "25px" }}>
        User Management
      </h2>

      <div
        style={{
          background: "rgba(30, 41, 59, 0.6)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "25px"
        }}
      >
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px",
              borderRadius: "14px",
              marginBottom: "12px",
              background: "rgba(51, 65, 85, 0.4)",
              position: "relative"
            }}
          >
            {/* LEFT */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#3a86ff,#4361ee)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600"
                }}
              >
                {(user.name?.[0] ||
                  user.username?.[0] ||
                  "U").toUpperCase()}
              </div>

              <div>
                <div style={{ fontWeight: "600" }}>
                  {user.name || user.username}
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                  {user.email}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background:
                    user.role === "ADMIN"
                      ? "#ef476f"
                      : user.role === "BLOCKED"
                      ? "#6c757d"
                      : "#3a86ff"
                }}
              >
                {user.role}
              </span>

              <div style={{ position: "relative" }}>
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === user.id ? null : user.id)
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#cbd5e1"
                  }}
                >
                  ⋮
                </button>

                {openMenu === user.id && (
                  <div
                    ref={menuRef}
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "35px",
                      background: "#0f172a",
                      borderRadius: "12px",
                      padding: "10px",
                      width: "170px",
                      boxShadow:
                        "0 20px 40px rgba(0,0,0,0.45)",
                      zIndex: 999
                    }}
                  >
                    {user.role !== "ADMIN" && (
                      <div
                        style={menuItem}
                        onClick={() => {
                          changeRole(user.id, "ADMIN");
                          setOpenMenu(null);
                        }}
                      >
                        Make Admin
                      </div>
                    )}

                    {user.role === "ADMIN" && (
                      <div
                        style={menuItem}
                        onClick={() => {
                          changeRole(user.id, "USER");
                          setOpenMenu(null);
                        }}
                      >
                        Make User
                      </div>
                    )}

                    {user.role !== "BLOCKED" ? (
                      <div
                        style={menuItem}
                        onClick={() => {
                          blockUser(user.id);
                          setOpenMenu(null);
                        }}
                      >
                        Block
                      </div>
                    ) : (
                      <div
                        style={menuItem}
                        onClick={() => {
                          unblockUser(user.id);
                          setOpenMenu(null);
                        }}
                      >
                        Unblock
                      </div>
                    )}

                    <div
                      style={{ ...menuItem, color: "#ef476f" }}
                      onClick={() => {
                        deleteUser(user.id);
                        setOpenMenu(null);
                      }}
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const menuItem = {
  padding: "10px 14px",
  fontSize: "14px",
  cursor: "pointer",
  borderRadius: "8px"
};

export default AdminUsers;