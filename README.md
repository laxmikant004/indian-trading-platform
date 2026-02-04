# Indian Trading Platform (Mini Project)

## 📌 Project Overview
This is a **Mini Project** developed for college submission using **Scrum methodology**.  
The project focuses on building the backend authentication system for an **Indian Trading Platform**.

Currently completed up to **Sprint 1**.

---

## 🛠 Tech Stack
### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (Authentication)
- bcrypt (Password Hashing)

### Frontend (Planned)
- React.js

### Tools
- Git & GitHub
- Postman
- Nodemon

---

## 📂 Project Structure (Server)
```
server/
│── controllers/
│   └── authController.js
│
│── routes/
│   └── authRoutes.js
│
│── config/
│   └── db.js
│
│── index.js
│── package.json
│── .env (ignored)
```

---

## ✅ Sprint 1 Goals
- Project setup
- GitHub repository creation
- User authentication system
  - Register API
  - Login API with JWT

Sprint 1 has been **successfully completed**.

---

## 🔐 Authentication APIs

### 1️⃣ Register User
**Endpoint**
```
POST /api/auth/register
```

**Request Body**
```json
{
  "name": "laxmikant",
  "email": "laxmikant@gmail.com",
  "password": "123456"
}
```

**Response**
```json
{
  "message": "User registered successfully"
}
```

---

### 2️⃣ Login User
**Endpoint**
```
POST /api/auth/login
```

**Request Body**
```json
{
  "email": "laxmikant@gmail.com",
  "password": "123456"
}
```

**Response**
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN"
}
```

---

## ⚙️ Setup Instructions

### 🔹 Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL
- Git

---

### 🔹 Linux Setup
```bash
git clone https://github.com/your-username/indian-trading-platform.git
cd indian-trading-platform/server
npm install
```

Create `.env` file:
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=trading_db
JWT_SECRET=your_secret_key
```

Run server:
```bash
npx nodemon index.js
```

---

### 🔹 Windows Setup
```cmd
git clone https://github.com/your-username/indian-trading-platform.git
cd indian-trading-platform\server
npm install
```

Create `.env` file (same as Linux)

Run server:
```cmd
npx nodemon index.js
```

---

## 🗄 Database Schema
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
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
- Sprint 1 Focus: Authentication Module
- Sprint Outcome: Secure login & registration system

---

## 👨‍🎓 Academic Use
This project is created for **educational purposes** and college evaluation.

---

## 🚀 Next Sprint (Planned)
- JWT Middleware (Protected routes)
- Trading APIs (Buy / Sell simulation)
- Wallet balance
- Order history

---

## 📄 License
This project is for academic use only.
