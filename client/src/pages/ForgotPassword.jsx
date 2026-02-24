import React, { useState } from "react";
import "./ForgotPassword.css";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      const res = await API.post("/auth/forgot-password", { email });

      // Show confirmation message
      setMessage(res.data.message || "If a user exists, a reset link has been sent");

      // Automatically navigate to Reset Password page (dev-friendly)
      if (res.data.resetLink) {
        const token = res.data.resetLink.split("/").pop();
        navigate(`/reset-password/${token}`);
      }

    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="overlay"></div>

      <div className="forgot-container">
        <div className="glass-card">
          <h2>🔑 Forgot Password</h2>
          <p>Enter your email to receive a password reset link</p>

          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {message && <p className="success-msg">{message}</p>}
            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link →"}
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

export default ForgotPassword;