# 🇮🇳 Indian Trading Platform (Mini Project)

## 📌 Project Overview
This is a **college mini project** developed using the **Scrum methodology**.

The project is a **full-stack Indian Trading Platform** that allows users to:
- Register & Login securely
- View Indian stock market data (NSE & BSE)
- Logout securely using JWT token handling

📍 **Current Status:**  
✅ Sprint 1 completed  
✅ Market Dashboard implemented

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
│   │   ├── components/
│   │   └── services/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── index.js
│
└── README.md
```

---

## ✅ Completed Features (Sprint 1)

- User Registration
- User Login (JWT based)
- Logout (clears token from localStorage)
- Market Dashboard
- Live NSE & BSE data using Yahoo Finance API

---

## 📊 Market Dashboard

Displays real-time Indian market data with color-coded gains and losses.

---

## 🔐 Authentication Flow

1. User registers → password hashed
2. User logs in → JWT token generated
3. Token stored in localStorage
4. Token auto-attached to requests
5. Logout clears token

---

## 🌐 API Endpoints

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/market`

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/laxmikant004/indian-trading-platform.git
cd indian-trading-platform
```

---

## 🎓 Academic Note
For educational use only.

---

## 👨‍💻 Author
**Laxmikant**
