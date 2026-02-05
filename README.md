# Indian Trading Platform (Mini Project)

## 📌 Project Overview
This is a **Mini Project** developed for college submission using **Scrum methodology**.
The project focuses on building a **full-stack authentication system** for an **Indian Trading Platform** using React and Node.js.

Currently completed up to **Sprint 2 (Authentication – Backend + Frontend)**.

---

## 🛠 Tech Stack
### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (Authentication)
- bcrypt (Password Hashing)

### Frontend
- React.js
- React Router DOM
- Bootstrap
- Axios

### Tools
- Git & GitHub
- Postman
- Nodemon

---

## 📂 Project Structure
```
indian-trading-platform/
├── client/        # React frontend
├── server/        # Node.js backend
└── README.md
```

---

## ✅ Sprint Progress

### Sprint 1
- Project setup
- GitHub repository creation
- Backend authentication
  - Register API
  - Login API with JWT

### Sprint 2
- Frontend setup (React)
- Login page
- Register page
- Dashboard page
- JWT handling in frontend
- Logout functionality

Sprint 1 & 2 have been **successfully completed**.

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
  "username": "laxmikant",
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

### 🔹 Linux / macOS Setup
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

Run backend:
```bash
npx nodemon index.js
```

Run frontend:
```bash
cd ../client
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
  username VARCHAR(100) NOT NULL,
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

---

## 🎓 Academic Use
This project is created for **educational purposes only**.

---

## 🚀 Next Sprint (Planned)
- Protected routes middleware
- Role-based access (User/Admin)
- Trading APIs (Buy / Sell simulation)
- Wallet balance
- Order history

---

## 👨‍💻 Author
**Laxmikant**  
Indian Trading Platform – Mini Project

