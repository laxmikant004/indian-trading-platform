# 🇮🇳 Indian Trading Platform

A Full-Stack Stock Trading Simulation Platform built using **React,
Node.js, Express, and PostgreSQL** with real-time market price
integration via Yahoo Finance.

------------------------------------------------------------------------

## 🚀 Overview

This platform allows users to:

-   Register & Login securely (JWT Authentication)
-   Place BUY / SELL Orders
-   Use Market, Limit & Stop-Loss Orders
-   Manage Portfolio & Balance
-   Track Trade History
-   Maintain a Watchlist
-   Admin Monitoring & Analytics Dashboard

------------------------------------------------------------------------

## 🏗️ Project Architecture

indian-trading-platform/ │ ├── client/ \# React Frontend ├── server/ \#
Express Backend ├── schema.sql \# PostgreSQL Database Schema └──
README.md

------------------------------------------------------------------------

## ⚙️ System Requirements

  Software     Recommended Version
  ------------ ---------------------
  Node.js      v18+
  npm          v9+
  PostgreSQL   v14+
  Git          Latest

Verify installation:

    node -v
    npm -v
    psql --version

------------------------------------------------------------------------

## 🗄️ Database Setup

### 1️⃣ Create Database

    CREATE DATABASE trading_platform;

### 2️⃣ Run Schema

From project root:

    psql -U postgres -d trading_platform -f schema.sql

This creates:

-   users
-   portfolios
-   orders
-   trades
-   watchlist

------------------------------------------------------------------------

## 🔐 Backend Environment Setup

Navigate to server folder:

    cd server

Create a `.env` file:

    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_NAME=trading_platform
    DB_HOST=localhost
    JWT_SECRET=your_super_secret_key
    PORT=5000

------------------------------------------------------------------------

## 🚀 Backend Setup

Install dependencies:

    npm install

Run server:

    node index.js

Or development mode:

    npx nodemon index.js

Server runs at:

    http://localhost:5000

Health Check:

    GET /api/health

------------------------------------------------------------------------

## 💻 Frontend Setup

Navigate to client:

    cd client
    npm install
    npm start

Frontend runs at:

    http://localhost:3000

------------------------------------------------------------------------

## 🔄 Automated Order Execution Engine

The backend includes a production-safe order execution engine:

-   Executes every 15 seconds
-   Fetches live market prices
-   Processes LIMIT & STOP_LOSS orders
-   Validates user balance and holdings
-   Uses PostgreSQL transactions (BEGIN / COMMIT / ROLLBACK)
-   Uses FOR UPDATE SKIP LOCKED for concurrency safety

------------------------------------------------------------------------

## 🔒 Security Features

-   Password hashing using bcrypt
-   JWT-based authentication
-   Role-based access control (USER / ADMIN)
-   Protected routes middleware
-   Transaction-safe execution

------------------------------------------------------------------------

## 📊 Features

### 👤 User

-   Register / Login
-   Buy & Sell Stocks
-   Portfolio Tracking
-   Trade History
-   Watchlist Management
-   Password Reset

### 👨‍💼 Admin

-   Admin Dashboard
-   View Users
-   View Orders
-   View Trades
-   Platform Analytics

------------------------------------------------------------------------

## 🧪 Quick Start (Full Setup)

    git clone https://github.com/your-username/indian-trading-platform.git
    cd indian-trading-platform

    # Setup database first

    cd server
    npm install
    npx nodemon index.js

    # Open new terminal
    cd client
    npm install
    npm start

------------------------------------------------------------------------

## 🐞 Troubleshooting

-   Ensure PostgreSQL is running
-   Verify .env credentials
-   Ensure backend runs before frontend
-   Wait 15 seconds for order engine execution

------------------------------------------------------------------------

## 🎓 Academic Purpose

This project demonstrates:

-   Full-Stack Development
-   REST API Design
-   Authentication & Authorization
-   Financial Order Simulation
-   Database Transaction Handling
-   Admin Dashboard Architecture

------------------------------------------------------------------------

## 📜 License

Developed for educational and academic purposes.
