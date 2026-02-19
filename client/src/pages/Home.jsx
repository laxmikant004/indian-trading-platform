import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* HERO */}
      <div className="hero-section">
        <h1>
          The Future of <span>Indian Trading</span>
        </h1>

        <p>
          Trade NSE & BSE with real-time data, lightning-fast execution,
          and zero brokerage — built for modern investors.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/register")} className="primary-btn">
            Get Started
          </button>

          <button onClick={() => navigate("/login")} className="secondary-btn">
            Login
          </button>
        </div>
      </div>

      {/* LIVE MARKET CARDS */}
      <div className="market-section">
        <h2>Live Market Indices</h2>

        <div className="market-grid">
          <div className="market-card positive">
            <h4>NIFTY 50</h4>
            <h3>24,502.15</h3>
            <p>+0.58%</p>
          </div>

          <div className="market-card positive">
            <h4>SENSEX</h4>
            <h3>80,845.75</h3>
            <p>+0.58%</p>
          </div>

          <div className="market-card negative">
            <h4>BANK NIFTY</h4>
            <h3>52,103.4</h3>
            <p>-0.17%</p>
          </div>

          <div className="market-card positive">
            <h4>NIFTY IT</h4>
            <h3>43,210.8</h3>
            <p>+0.73%</p>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="metrics-section">
        <div className="metric-card">
          <h2>1.2Cr+</h2>
          <p>Active Traders</p>
        </div>

        <div className="metric-card">
          <h2>₹4.8L Cr</h2>
          <p>Daily Volume</p>
        </div>

        <div className="metric-card">
          <h2>99.99%</h2>
          <p>Platform Uptime</p>
        </div>

        <div className="metric-card">
          <h2>&lt;10ms</h2>
          <p>Order Execution</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
