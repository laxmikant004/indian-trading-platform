# Indian Trading Platform – Mini Project

This project is developed as a **college mini project** using the **Scrum methodology**.  
The goal of the project is to build a basic Indian Trading Platform with user authentication and further trading-related features.

---

## 📌 Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Version Control:** Git & GitHub  

---

## 📂 Project Structure

```
indian-trading-platform/
│
├── client/        # React frontend
├── server/        # Node.js backend
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

## 🐧 Setup on Linux (Ubuntu)

### 1️⃣ Install Required Software
```bash
sudo apt update
sudo apt install nodejs npm postgresql git -y
```

Verify installation:
```bash
node -v
npm -v
psql --version
```

---

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/indian-trading-platform.git
cd indian-trading-platform
```

---

### 3️⃣ Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:
```env
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=trading_platform
DB_HOST=localhost
JWT_SECRET=your_secret_key
```

---

### 4️⃣ PostgreSQL Database Setup
```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE trading_platform;
\c trading_platform;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(10) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Exit PostgreSQL:
```sql
\q
```

---

### 5️⃣ Run Backend Server
```bash
npx nodemon index.js
```

Server will run at:
```
http://localhost:5000
```

---

## 🪟 Setup on Windows

### 1️⃣ Install Required Software
- Node.js (LTS): https://nodejs.org  
- PostgreSQL: https://www.postgresql.org/download/windows/  
- Git: https://git-scm.com/downloads  

---

### 2️⃣ Clone the Repository
Open **Git Bash**:
```bash
git clone https://github.com/<your-username>/indian-trading-platform.git
cd indian-trading-platform
```

---

### 3️⃣ Backend Setup
```bash
cd server
npm install
```

Create `.env` file inside `server`:
```env
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=trading_platform
DB_HOST=localhost
JWT_SECRET=your_secret_key
```

---

### 4️⃣ PostgreSQL Setup
Use **pgAdmin** or **SQL Shell** to create the database and table (same as Linux setup).

---

### 5️⃣ Run Backend Server
```bash
npx nodemon index.js
```

---

## 🔐 Features Implemented (Sprint 1)

- Project setup with GitHub
- Backend using Node.js and Express
- PostgreSQL database integration
- User Registration API
- Password hashing using bcrypt
- Proper error handling

---

## 👥 How to Contribute (Team Collaboration)

1. Clone the repository
2. Create a new branch
3. Commit changes
4. Push branch
5. Create Pull Request

---

## 🚀 Future Enhancements

- Login API with JWT authentication
- Trading dashboard
- Portfolio management

---

## 👨‍💻 Project For

College Mini Project  
Department of Computer Science / Information Technology
