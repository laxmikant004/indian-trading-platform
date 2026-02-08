# 🇮🇳 Indian Trading Platform (Mini Project)

## 📌 Project Overview
This is a **college mini project** developed using the **Scrum methodology**.

The project is a **full-stack Indian Trading Platform** that allows users to:
- Register & Login securely (JWT based)
- View Indian stock market data (NSE & BSE)
- Access protected APIs
- Logout securely

📍 **Current Status:**  
✅ Sprint 1 completed  
✅ Authentication implemented  
✅ Protected Market Dashboard live  

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt
- yahoo-finance2 API
- CORS

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
│   │   └── marketController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── marketRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── config/
│   └── index.js
│
└── README.md
```

---

## ✅ Completed Features (Sprint 1)

- User Registration
- User Login (JWT based)
- Token stored in localStorage
- Logout (clears token)
- Protected Market API
- Market Dashboard with live data

---

## 📊 Market Dashboard

- Displays NSE & BSE indices
- Shows stock prices, change & % change
- Color-coded gain/loss
- Data fetched from Yahoo Finance API

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
- POST `/api/auth/register`
- POST `/api/auth/login`

### Market (Protected)
- GET `/api/market`

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
git commit -m "Update README with protected dashboard and auth flow"
git pull origin main --rebase
git push origin main
```

---

## 🎓 Academic Note
This project is created strictly for **educational purposes**.

---

## 👨‍💻 Author
**Laxmikant**
