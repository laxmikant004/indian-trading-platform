import React, { useState } from "react";
import "./Register.css";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed");
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
            Start Your <br />
            <span className="highlight">Trading Journey</span>
          </h1>

          <p>
            Create your account and access professional-grade tools with zero
            brokerage.
          </p>

          <div className="stats">
            <div>
              <h3>₹0</h3>
              <span>Brokerage</span>
            </div>
            <div>
              <h3>Fast</h3>
              <span>Execution</span>
            </div>
            <div>
              <h3>Secure</h3>
              <span>Platform</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">
          <div className="glass-card">
            <h2>📝 Create Account</h2>
            <p>Open your trading account in seconds</p>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />

              {/* PASSWORD */}
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="password-field">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {errorMsg && <p className="error-msg">{errorMsg}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account →"}
              </button>
            </form>

            <p className="signup">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;