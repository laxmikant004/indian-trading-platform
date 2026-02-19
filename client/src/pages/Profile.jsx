import React, { useEffect, useState } from "react";
import { getProfile } from "../services/authApi";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <h3 style={{ padding: "40px" }}>Loading profile...</h3>;

  return (
    <div
      style={{
        background: "#0b1220",
        minHeight: "100vh",
        padding: "50px 60px",
        color: "white",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>User Profile</h2>

      <div
        style={{
          background: "#111827",
          padding: "30px",
          borderRadius: "16px",
          maxWidth: "500px",
        }}
      >
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
