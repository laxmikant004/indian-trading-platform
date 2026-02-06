# Indian Trading Platform (Mini Project)

## 📌 Project Overview
This is a **Mini Project** developed for college submission using **Scrum methodology**.

The project is a **full‑stack Indian Trading Platform** that includes:
- User Authentication (Register / Login / Logout)
- Market Dashboard with **NSE & BSE live data** using **Yahoo Finance API**
- React frontend + Node.js backend

Current status: **Sprint 1 completed + Market Dashboard implemented**

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt
- yahoo-finance2 API
- CORS

### Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap

---

## 📂 Project Structure
```
indian-trading-platform/
├── client/
├── server/
│   ├── controllers/
│   ├── routes/
│   └── index.js
└── README.md
```

---

## ✅ Completed Features
- User Registration
- User Login
- Logout
- Market Dashboard
- NSE & BSE data (Yahoo Finance)

---

## 📈 API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/market

---

## ⚙️ Setup Instructions

### Backend
```bash
cd server
npm install
npx nodemon index.js
```

### Frontend
```bash
cd client
npm install
npm start
```

---

### 🔹 Windows Setup
```cmd
git clone https://github.com/your-username/indian-trading-platform.git
cd indian-trading-platform\server
npm install
```

Create `.env` file (same as Linux)

Run backend:
```cmd
npx nodemon index.js
```

Run frontend:
```cmd
cd ..\client
npm install
npm start
```

---

## 🗄 Database Schema
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🤝 Contribution Guidelines
1. Fork the repository
2. Create a new branch
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes
   ```bash
   git commit -m "Added new feature"
   ```
4. Push to your branch
   ```bash
   git push origin feature-name
   ```
5. Create a Pull Request

---

## 📘 Scrum Details
- Sprint Duration: 1 Week
- Sprint 1 Focus: Backend Authentication
- Sprint 2 Focus: Frontend Authentication
## 🤝 Contribution
Fork the repo → Create branch → Commit → Push → PR

---

## 🎓 Academic Use
This project is for **educational purposes only**.

---

## 👨‍💻 Author
Laxmikant
