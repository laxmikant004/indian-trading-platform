import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; // reuse styling
import API from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || "Password reset successful");
      // Optionally redirect to login after short delay
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="overlay"></div>

      <div className="forgot-container">
        <div className="glass-card">
          <h2>🔄 Reset Password</h2>
          <p>Enter your new password below</p>

          <form onSubmit={handleReset}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {message && <p className="success-msg">{message}</p>}
            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password →"}
            </button>

            <div className="back-to-login">
              <Link to="/login">← Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;