import React, { useState } from "react";
import "./Login.css";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "ADMIN") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="overlay"></div>

      <div className="login-container">
        {/* LEFT SIDE */}
        <div className="left-section">
          <h2 className="brand">
            <img src="/unnamed.png" alt="logo" className="logo" />
            Indian Trading <span>Platform</span>
          </h2>

          <h1>
            Trade Smarter, <br />
            <span className="highlight">Not Harder</span>
          </h1>

          <p>
            Access NSE & BSE markets with professional tools, real-time data and
            zero brokerage.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">
          <div className="glass-card">
            <h2>🔐 Welcome Back</h2>
            <p>Login to your trading account</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {errorMsg && <p className="error-msg">{errorMsg}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In →"}
              </button>

              <div className="forgot-password">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;