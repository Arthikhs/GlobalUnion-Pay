# 🏦 Bank Management & Security

> A complete Full Stack Banking Ecosystem built by **Arthikhs** — three production-ready projects in one repository.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-ready-blue?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/License-Educational-lightgrey?style=flat-square)

---

## 📁 Repository Structure

```
bank-management-security/
│
├── 🏧 atm-project/              ATM Simulation — React Frontend
│   ├── src/
│   │   ├── components/ATMMachine.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── 🏦 bank-project/             Bank Portal — React + Spring Boot
│   ├── src/                     React Frontend
│   │   ├── components/          BankDetails, CreateAccount, Deposit...
│   │   ├── pages/               Dashboard, LoginPage
│   │   ├── AccountContext.js
│   │   └── TransactionContext.js
│   ├── backend/                 Spring Boot Backend
│   │   └── src/main/java/com/globalunion/pay/
│   │       ├── controller/
│   │       ├── model/
│   │       ├── repository/
│   │       ├── security/        JWT + Spring Security
│   │       └── PayApplication.java
│   └── package.json
│
└── 💸 globalunionpay-upi/       UPI Platform — 10 Microservices + React TS
    ├── backend/
    │   ├── api-gateway/         Port 8080
    │   ├── auth-service/        Port 8081
    │   ├── user-service/        Port 8082
    │   ├── upi-service/         Port 8083
    │   ├── payment-service/     Port 8084
    │   ├── wallet-service/      Port 8085
    │   ├── transaction-service/ Port 8086
    │   ├── notification-service/Port 8087
    │   ├── fraud-service/       Port 8088
    │   ├── analytics-service/   Port 8089
    │   └── merchant-service/
    ├── frontend/                React 18 + TypeScript + Tailwind
    ├── docker-compose.yml
    └── pom.xml
```

---

## 🏧 Project 1 — ATM Simulation

A realistic ATM machine simulation built with React.js.

### Features
- 💳 Card insert & eject flow
- 🔢 Secure PIN authentication
- 💰 Cash withdrawal with custom amount
- 🏦 Balance enquiry
- 📋 Mini statement
- 📌 PIN change

### Run

```bash
cd atm-project
npm install
set PORT=3001 && npm start
# → http://localhost:3001
```

---

## 🏦 Project 2 — Bank Portal

A full-stack employee banking portal with React.js frontend and Spring Boot backend.

### Features
- 🔐 JWT-based employee login with split-screen UI
- 🏦 Bank details — balance, IFSC, branch, revenue overview
- 👤 Create, edit & delete customer accounts
- 💰 Deposit & withdrawal with real-time balance validation
- 🔄 Fund transfer with 3-step confirmation flow
- 🧑‍💼 Customer details & per-account transaction history
- 🏛️ Loan management — Education, Business, Vehicle, Agriculture, Property + EMI calculator
- 💳 ATM card generator — generate & download as PDF

### Demo Credentials

| Field | Value |
|---|---|
| Employee ID | `EMP001` |
| Password | `bank@1234` |

### Run

```bash
# 1. Start Backend
cd bank-project/backend
mvn spring-boot:run
# → http://localhost:8080

# 2. Start Frontend
cd bank-project
npm install
npm start
# → http://localhost:3000
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Employee login |
| GET | `/api/accounts` | Get all accounts |
| POST | `/api/accounts` | Create account |
| PUT | `/api/accounts/{id}` | Update account |
| DELETE | `/api/accounts/{id}` | Delete account |
| POST | `/api/transactions/deposit` | Deposit funds |
| POST | `/api/transactions/withdraw` | Withdraw funds |
| POST | `/api/transactions/transfer` | Fund transfer |
| GET | `/api/loans` | Get all loans |
| POST | `/api/loans` | Issue loan |
| PUT | `/api/loans/{id}/close` | Close loan |

---

## 💸 Project 3 — GlobalUnionPay UPI Platform

A production-grade UPI payment platform inspired by PhonePe, Google Pay and Razorpay — built with Java 21 Spring Boot Microservices and React 18 + TypeScript.

### Features
- 📱 PhonePe-style payment flow — Enter phone/UPI → Validate → Amount → PIN → Success
- 🔔 Real-time notifications via Spring WebSocket + Kafka
- 🛡️ Fraud detection with Spring AOP + Redis pattern analysis
- 📦 Spring Batch for bulk transaction settlement
- ⚡ Redis caching for user profiles, balances, UPI validation
- 🔐 JWT + Spring Security with role-based access control
- 🗄️ Flyway database migrations
- 🔄 Resilience4j circuit breaker on payment calls
- 🚀 GitHub Actions CI/CD pipeline with Docker + AWS deploy
- 🏪 Merchant portal with settlement management
- 📊 Analytics dashboard with Kafka consumer

### Microservices

| Service | Port | Responsibility |
|---|---|---|
| API Gateway | 8080 | Routing, auth filter |
| Auth Service | 8081 | JWT, OTP, registration |
| User Service | 8082 | Profile, KYC, referral |
| UPI Service | 8083 | UPI IDs, VPA, QR codes |
| Payment Service | 8084 | Payment flow, Razorpay, scheduled |
| Wallet Service | 8085 | Balance, add money, deduct |
| Transaction Service | 8086 | History, Spring Batch, PostgreSQL |
| Notification Service | 8087 | WebSocket, Kafka consumer |
| Fraud Service | 8088 | Risk scoring, AOP, pattern detection |
| Analytics Service | 8089 | Dashboard stats, Kafka consumer |
| Merchant Service | — | Merchant portal, settlements |

### Run — Docker (Recommended)

```bash
cd globalunionpay-upi
docker-compose up -d
# Frontend  → http://localhost:4000
# API Gateway → http://localhost:8080
```

### Run — Manual

```bash
# Start infrastructure
docker-compose up -d mysql postgres redis zookeeper kafka

# Start each backend service
cd globalunionpay-upi/backend/auth-service        && mvn spring-boot:run
cd globalunionpay-upi/backend/user-service        && mvn spring-boot:run
cd globalunionpay-upi/backend/upi-service         && mvn spring-boot:run
cd globalunionpay-upi/backend/payment-service     && mvn spring-boot:run
cd globalunionpay-upi/backend/wallet-service      && mvn spring-boot:run
cd globalunionpay-upi/backend/transaction-service && mvn spring-boot:run
cd globalunionpay-upi/backend/notification-service&& mvn spring-boot:run
cd globalunionpay-upi/backend/fraud-service       && mvn spring-boot:run
cd globalunionpay-upi/backend/analytics-service   && mvn spring-boot:run
cd globalunionpay-upi/backend/api-gateway         && mvn spring-boot:run

# Start frontend
cd globalunionpay-upi/frontend
npm install && npm run dev
# → http://localhost:5173
```

### Swagger API Docs

| Service | URL |
|---|---|
| Auth | http://localhost:8081/swagger-ui.html |
| User | http://localhost:8082/swagger-ui.html |
| UPI | http://localhost:8083/swagger-ui.html |
| Payment | http://localhost:8084/swagger-ui.html |

### Environment Variables

```env
MYSQL_ROOT_PASSWORD=your_password
POSTGRES_PASSWORD=your_password
JWT_SECRET=your_very_long_secret_key
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
AWS_EC2_HOST=your_ec2_ip
```

---

## 🛠 Tech Stack

### Frontend

| Project | Technology |
|---|---|
| ATM | React.js, JavaScript, CSS |
| Bank Portal | React.js, JavaScript, React Router v6, jsPDF |
| UPI Platform | React 18, TypeScript, Tailwind CSS, Zustand, React Query, Framer Motion, Recharts, Axios, STOMP.js |

### Backend

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.2 |
| Security | Spring Security + JWT |
| ORM | Spring Data JPA + Hibernate |
| Messaging | Apache Kafka |
| Cache | Redis |
| Batch | Spring Batch |
| WebSocket | Spring WebSocket + STOMP |
| DB (Bank) | H2 (dev) / MySQL (prod) |
| DB (UPI Primary) | MySQL 8 |
| DB (UPI Analytics) | PostgreSQL 15 |
| Migration | Flyway |
| Docs | OpenAPI / Swagger 3 |
| Resilience | Resilience4j Circuit Breaker |

### DevOps & Cloud

| Tool | Usage |
|---|---|
| Docker | Containerization |
| Kubernetes | Orchestration |
| GitHub Actions | CI/CD pipeline |
| AWS EC2 | Compute |
| AWS RDS | Managed database |
| AWS S3 | File storage |

---

## 🚀 CI/CD Pipeline

```
Push to main
  → GitHub Actions
  → Maven Build + npm Build
  → Docker build & push to GHCR
  → SSH deploy to AWS EC2
  → docker-compose up -d
```

---

## 👨‍💻 Developer

**Arthikhs** — Full Stack Java Developer

- Languages: Java, JavaScript, TypeScript
- Backend: Spring Boot, Spring Security, Spring Data JPA, Hibernate, REST APIs, JWT, Microservices, Spring Batch, Spring WebSocket
- Frontend: React.js, Next.js, Tailwind CSS, TypeScript
- Databases: MySQL, PostgreSQL, Redis
- Messaging: Apache Kafka
- Cloud & DevOps: Docker, Kubernetes, AWS (EC2, S3, RDS), GitHub Actions, CI/CD
- Tools: Git, GitHub, JUnit, Postman, Swagger

---

## 📄 License

This project is for educational and portfolio purposes.

---

> Built with ❤️ by **Arthikhs** — Bank Management & Security
