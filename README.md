# 🏦 GlobalUnion Pay — Full Stack Banking & FinTech Platform

A complete enterprise-grade banking ecosystem built by **Arthikhs**, containing two full-stack projects:

| Project | Description |
|---|---|
| 🏦 **Bank & ATM System** | Employee banking portal + ATM simulation (React + Spring Boot) |
| 💸 **GlobalUnionPay UPI Platform** | Production-grade UPI payment platform with 10 microservices (Java 21 + React + TypeScript) |

---

## 📁 Repository Structure

```
GlobalUnion-Pay/
├── src/                        # 🏦 Bank Project — React Frontend
├── ATM-Project/                # 🏧 ATM Simulation — React Frontend
├── backend/                    # ☕ Bank Project — Spring Boot Backend
├── public/
├── package.json
│
└── GlobalUnionPay-UPI/         # 💸 UPI Platform (Microservices)
    ├── backend/
    │   ├── api-gateway/        # Port 8080
    │   ├── auth-service/       # Port 8081
    │   ├── user-service/       # Port 8082
    │   ├── upi-service/        # Port 8083
    │   ├── payment-service/    # Port 8084
    │   ├── wallet-service/     # Port 8085
    │   ├── transaction-service/# Port 8086
    │   ├── notification-service/# Port 8087
    │   ├── fraud-service/      # Port 8088
    │   └── analytics-service/  # Port 8089
    ├── frontend/               # React 18 + TypeScript
    └── docker-compose.yml
```

---

# 🏦 Project 1 — Bank & ATM Management System

A modern **Employee Banking Portal & ATM Simulation** built with React.js and Spring Boot for internal bank employee use.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, JavaScript |
| Routing | React Router DOM v6 |
| Styling | Plain CSS (custom) |
| State | React Hooks, Context API |
| Backend | Java 21, Spring Boot |
| Security | Spring Security, JWT |
| ORM | Spring Data JPA, Hibernate |
| Database | H2 (dev), MySQL / PostgreSQL (prod) |
| Cache | Redis |
| Messaging | Apache Kafka |
| Cloud | AWS (EC2, S3, RDS) |
| DevOps | Docker, Kubernetes, GitHub Actions |

## Features

### 🏦 Bank Portal
- 🔐 Secure Employee Login — JWT authentication with split-screen UI
- 🏦 Bank Details — Account balance, IFSC, branch, revenue & transaction overview
- 👤 Create & Edit Account — Open savings/current accounts, edit or delete
- 💰 Deposit & Withdrawal — Real-time balance validation
- 🔄 Fund Transfer — 3-step confirmation flow
- 🧑‍💼 Customer Details — Full profile & per-account transaction history
- 🏛️ Loan Management — Education, Business, Vehicle, Agriculture, Property loans with EMI calculator
- 💳 ATM Card Generator — Generate and download ATM card PDF

### 🏧 ATM Simulation
- 💳 Realistic card insert flow
- 🔢 Secure PIN authentication
- 💰 Cash withdrawal with custom amount
- 🏦 Balance enquiry & mini statement
- 📌 PIN change

## Run — Bank & ATM Project

### Prerequisites
- Node.js >= 14.x
- Java 17+
- Maven

```bash
# 1. Start Backend
cd backend
mvn spring-boot:run
# Runs at http://localhost:8080

# 2. Start Bank Frontend (new terminal)
npm install
npm start
# Runs at http://localhost:3000

# 3. Start ATM Project (new terminal)
cd ATM-Project
npm install
set PORT=3001 && npm start
# Runs at http://localhost:3001
```

## Demo Credentials

| Field | Value |
|---|---|
| Employee ID | `EMP001` |
| Password | `bank@1234` |

## API Endpoints

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

# 💸 Project 2 — GlobalUnionPay UPI Platform

A production-grade UPI payment platform inspired by PhonePe, Google Pay, and Razorpay — built with Java 21 Spring Boot Microservices and React 18 + TypeScript.

## Tech Stack

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
| DB (Primary) | MySQL 8 |
| DB (Analytics) | PostgreSQL 15 |
| Migration | Flyway |
| Docs | OpenAPI / Swagger 3 |
| Resilience | Resilience4j Circuit Breaker |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Data Fetching | React Query (TanStack) |
| Charts | Recharts |
| Animations | Framer Motion |
| HTTP | Axios |
| WebSocket | STOMP.js + SockJS |

### DevOps
| Tool | Usage |
|---|---|
| Docker | Containerization |
| Kubernetes | Orchestration |
| GitHub Actions | CI/CD |
| AWS EC2 | Compute |
| AWS RDS | Managed DB |
| AWS S3 | File Storage |

## Microservices Architecture

```
API Gateway (8080)
├── Auth Service        (8081) – JWT, OTP, Spring Security
├── User Service        (8082) – Profile, KYC, Referral
├── UPI Service         (8083) – UPI IDs, VPA, QR, Payments
├── Payment Service     (8084) – Payment flow, Razorpay, Scheduled
├── Wallet Service      (8085) – Balance, Add Money, Deduct
├── Transaction Service (8086) – History, Spring Batch, PostgreSQL
├── Notification Service(8087) – WebSocket, Kafka Consumer
├── Fraud Service       (8088) – Risk scoring, AOP, Pattern detection
├── Analytics Service   (8089) – Dashboard stats, Kafka consumer
└── Merchant Service    (8088) – Merchant portal, Settlements
```

## Key Features

- PhonePe-style payment flow — Enter phone/UPI → Validate → Amount → PIN → Success
- Real-time notifications via Spring WebSocket + Kafka
- Fraud detection with Spring AOP + Redis pattern analysis
- Spring Batch for bulk transaction settlement
- Redis caching for user profiles, balances, UPI validation
- JWT + Spring Security with role-based access control
- Flyway database migrations
- Resilience4j circuit breaker on payment calls
- GitHub Actions CI/CD pipeline with Docker build + AWS deploy

## Run — UPI Platform

### Option 1: Docker Compose (Recommended)

```bash
cd GlobalUnionPay-UPI
docker-compose up -d
```

- Frontend → http://localhost:4000
- API Gateway → http://localhost:8080

### Option 2: Manual

```bash
# Start infrastructure first
docker-compose up -d mysql postgres redis zookeeper kafka

# Then start each service
cd GlobalUnionPay-UPI/backend/auth-service && mvn spring-boot:run
cd GlobalUnionPay-UPI/backend/user-service && mvn spring-boot:run
cd GlobalUnionPay-UPI/backend/upi-service && mvn spring-boot:run
cd GlobalUnionPay-UPI/backend/payment-service && mvn spring-boot:run
cd GlobalUnionPay-UPI/backend/wallet-service && mvn spring-boot:run
cd GlobalUnionPay-UPI/backend/transaction-service && mvn spring-boot:run
cd GlobalUnionPay-UPI/backend/notification-service && mvn spring-boot:run
cd GlobalUnionPay-UPI/backend/fraud-service && mvn spring-boot:run
cd GlobalUnionPay-UPI/backend/analytics-service && mvn spring-boot:run
cd GlobalUnionPay-UPI/backend/api-gateway && mvn spring-boot:run

# Start frontend
cd GlobalUnionPay-UPI/frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

## Swagger API Docs

| Service | URL |
|---|---|
| Auth | http://localhost:8081/swagger-ui.html |
| User | http://localhost:8082/swagger-ui.html |
| UPI | http://localhost:8083/swagger-ui.html |
| Payment | http://localhost:8084/swagger-ui.html |

## Environment Variables

```env
MYSQL_ROOT_PASSWORD=your_password
POSTGRES_PASSWORD=your_password
JWT_SECRET=your_very_long_secret_key
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
AWS_EC2_HOST=your_ec2_ip
```

## CI/CD Pipeline

```
Push to main → GitHub Actions → Maven Build → npm Build
→ Docker build & push to GHCR → SSH deploy to AWS EC2
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

> Built with ❤️ by Arthikhs — GlobalUnion Pay
