# 🇮🇳 Indian Trading Platform (Mini Project)

## 📌 Project Overview

This is a **college mini project** developed using the **Scrum methodology**.

The project is a **full-stack Indian Trading Platform** that allows users to:

* Register & Login securely (JWT based)
* View Indian stock market data (NSE & BSE)
* Place Buy/Sell orders (paper trading)
* Track portfolio & trade history
* Access admin features

📍 **Current Status:**

* ✅ Sprint 1: Authentication & Dashboard
* ✅ Sprint 2: Market & Trading Engine
* ✅ Sprint 3: Portfolio & Trade History
* ✅ Sprint 4: Enhancements & Admin Controls

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* bcrypt
* yahoo-finance2 API
* CORS

---

## 📂 Project Structure

```
indian-trading-platform/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   └── services/
│   │       └── api.js
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── marketController.js
│   │   ├── orderController.js
│   │   ├── portfolioController.js
│   │   ├── tradeController.js
│   │   └── watchlistController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── marketRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── portfolioRoutes.js
│   │   ├── tradeRoutes.js
│   │   ├── watchlistRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── config/
│   └── index.js
│
└── README.md
```

---

## ✅ Sprint Deliverables

### Sprint 1 – Foundation

* User authentication
* Secure password storage (bcrypt)
* Basic dashboard UI

### Sprint 2 – Market & Trading

* Real-time NSE/BSE market data
* Buy/Sell orders (paper trading engine)
* Trade validation

### Sprint 3 – Portfolio & History

* Portfolio tracking
* Profit/Loss calculation
* Trade history and analytics
* Charts for portfolio performance

### Sprint 4 – Enhancements

* Watchlist feature
* Limit & Stop-loss orders
* Top gainers/losers
* Admin dashboard for user & trade management

---

## 🔐 Authentication Flow

1. User registers → password hashed using bcrypt
2. User logs in → JWT token generated
3. Token stored in localStorage
4. Axios interceptor attaches token automatically
5. Protected APIs verified via auth middleware
6. Logout removes token

---

## 🌐 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/auth/profile` (protected)

### Market (Protected)

* GET `/api/market`
* GET `/api/market/search/:symbol`
* GET `/api/market/suggestions`
* GET `/api/market/movers`

### Orders & Trades

* POST `/api/orders` (place order)
* POST `/api/trade/buy`
* POST `/api/trade/sell`
* GET `/api/trade/history`

### Portfolio

* GET `/api/portfolio`

### Watchlist

* POST `/api/watchlist`
* DELETE `/api/watchlist/:symbol`
* GET `/api/watchlist`

### Admin

* GET `/api/admin/stats`
* GET `/api/admin/users`
* PUT `/api/admin/users/:id/block`
* PUT `/api/admin/users/:id/unblock`
* DELETE `/api/admin/users/:id`
* GET `/api/admin/trades`
* GET `/api/admin/orders`

---

## ⚙️ Setup Instructions

### Clone Repository

```bash
git clone https://github.com/laxmikant004/indian-trading-platform.git
cd indian-trading-platform
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

Create `.env` file:

```
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 🚀 Git Push Steps

```bash
git add README.md
git commit -m "Update README with project details"
git pull origin main --rebase
git push origin main
```

---

## 🎓 Academic Note

This project is created strictly for **educational purposes**.

---

## 👨‍💻 Author

**Laxmikant**
