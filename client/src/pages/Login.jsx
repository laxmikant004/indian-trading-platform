import React, { useState } from "react";
import "./Login.css";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Store token
      localStorage.setItem("token", res.data.token);

      // Store full user object
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔥 Redirect based on role
      if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="overlay"></div>

      <div className="login-container">
        <div className="left-section">
          <h2 className="brand">
            📈 Indian Trading <span>Platform</span>
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
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit">Log In →</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;