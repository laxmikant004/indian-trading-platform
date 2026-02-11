import React, { useEffect, useState } from "react";
import { getProfile } from "../services/authApi";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <h3>Loading profile...</h3>;

  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;
