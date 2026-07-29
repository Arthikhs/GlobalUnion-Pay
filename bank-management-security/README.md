# 🏦 Bank Management & Security — Full Stack Banking Platform

Built by **Arthikhs** — Three complete projects in one repository.

```
bank-management-security/
├── atm-project/          🏧 ATM Simulation — React Frontend (Port 3001)
├── bank-project/         🏦 Bank Portal — React + Spring Boot (Port 3000 / 8080)
└── globalunionpay-upi/   💸 UPI Platform — 10 Microservices + React TypeScript
```

---

## 🏧 1. ATM Project — React Frontend

Realistic ATM simulation with card insert, PIN auth, withdrawal, balance enquiry, mini statement, PIN change.

```bash
cd atm-project
npm install
set PORT=3001 && npm start
```

---

## 🏦 2. Bank Project — React + Spring Boot

Employee banking portal with JWT login, account management, deposits, withdrawals, fund transfer, loans, ATM card generator.

**Demo:** `EMP001` / `bank@1234`

```bash
# Backend
cd bank-project/backend
mvn spring-boot:run
# → http://localhost:8080

# Frontend
cd bank-project
npm install
npm start
# → http://localhost:3000
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Employee login |
| GET/POST | `/api/accounts` | List / Create account |
| PUT/DELETE | `/api/accounts/{id}` | Update / Delete account |
| POST | `/api/transactions/deposit` | Deposit |
| POST | `/api/transactions/withdraw` | Withdraw |
| POST | `/api/transactions/transfer` | Transfer |
| GET/POST | `/api/loans` | List / Issue loan |
| PUT | `/api/loans/{id}/close` | Close loan |

---

## 💸 3. GlobalUnionPay UPI — Microservices Platform

Production-grade UPI platform (PhonePe/GPay style) with 10 Spring Boot microservices and React 18 + TypeScript frontend.

### Services

| Service | Port |
|---|---|
| API Gateway | 8080 |
| Auth Service | 8081 |
| User Service | 8082 |
| UPI Service | 8083 |
| Payment Service | 8084 |
| Wallet Service | 8085 |
| Transaction Service | 8086 |
| Notification Service | 8087 |
| Fraud Service | 8088 |
| Analytics Service | 8089 |

### Run with Docker (Recommended)

```bash
cd globalunionpay-upi
docker-compose up -d
# Frontend → http://localhost:4000
# API Gateway → http://localhost:8080
```

### Run Manually

```bash
# Start infrastructure
docker-compose up -d mysql postgres redis zookeeper kafka

# Start each service
cd globalunionpay-upi/backend/auth-service && mvn spring-boot:run
cd globalunionpay-upi/backend/user-service && mvn spring-boot:run
# ... repeat for each service

# Frontend
cd globalunionpay-upi/frontend
npm install && npm run dev
# → http://localhost:5173
```

### Environment Variables

```env
MYSQL_ROOT_PASSWORD=your_password
POSTGRES_PASSWORD=your_password
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Bank/ATM) | React.js, JavaScript, React Router v6 |
| Frontend (UPI) | React 18, TypeScript, Tailwind CSS, Zustand, React Query |
| Backend (Bank) | Java 21, Spring Boot, Spring Security, JWT, JPA, H2/MySQL |
| Backend (UPI) | Java 21, Spring Boot 3.2, Kafka, Redis, WebSocket, Flyway |
| Database | MySQL 8, PostgreSQL 15, H2 (dev) |
| DevOps | Docker, Kubernetes, GitHub Actions, AWS EC2/RDS/S3 |

---

> Built with ❤️ by **Arthikhs**
