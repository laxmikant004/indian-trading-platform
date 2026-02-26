import React, { useEffect, useState } from "react";
import API from "../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, {
        role: role === "ADMIN" ? "USER" : "ADMIN",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Title */}
      <h2 style={{ marginBottom: "20px", fontWeight: 500 }}>
        Users
      </h2>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {/* Table Card */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={styles.row}>
                <td>{user.id}</td>

                <td>
                  <div style={{ fontWeight: 500 }}>{user.name}</div>
                </td>

                <td style={{ color: "#94a3b8" }}>
                  {user.email}
                </td>

                <td>
                  <span
                    style={
                      user.role === "ADMIN"
                        ? styles.adminBadge
                        : styles.userBadge
                    }
                  >
                    {user.role}
                  </span>
                </td>

                <td style={{ textAlign: "right" }}>
                  <button
                    style={styles.actionBtn}
                    onClick={() => toggleRole(user.id, user.role)}
                  >
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={styles.empty}>
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#1e293b",
    borderRadius: "10px",
    padding: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",

  },

  theadRow: {
    borderBottom: "1px solid #334155",
    color: "#94a3b8",
    fontWeight: 500,
  },

  row: {
    borderBottom: "1px solid #1f2937",
  },

  search: {
    padding: "10px 14px",
    width: "320px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none",
  },

  adminBadge: {
    background: "#2d1b1b",
    color: "#f87171",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
  },

  userBadge: {
    background: "#1e3a8a33",
    color: "#60a5fa",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
  },

  actionBtn: {
    background: "transparent",
    border: "2px solid #334155",
    padding: "6px 18px",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
    
  },

  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default AdminUsers;