<div align="center">

# 🏦 Bank Management & Security

### A complete Full Stack Banking Ecosystem — 3 production-ready projects in one repository

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)](https://kafka.apache.org)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Arthikhs/GlobalUnion-Pay?style=for-the-badge&logo=github)](https://github.com/Arthikhs/GlobalUnion-Pay/stargazers)

<br/>

> Built by **[Arthikhs](https://github.com/Arthikhs)** — Full Stack Java Developer
>
> 🔗 **[GlobalUnion-Pay Repository](https://github.com/Arthikhs/GlobalUnion-Pay)**

<br/>

[🏧 ATM Demo](#-atm-simulation) • [🏦 Bank Portal](#-bank-portal) • [💸 UPI Platform](#-globalunionpay-upi-platform) • [🚀 Quick Start](#-quick-start) • [📖 Docs](#-swagger-api-docs)

</div>

---

## 📌 What's Inside

| # | Project | Stack | Description |
|---|---------|-------|-------------|
| 1 | 🏧 **ATM Simulation** | React.js | Realistic ATM machine with PIN auth, withdrawal, balance check |
| 2 | 🏦 **Bank Portal** | React + Spring Boot + JWT | Full employee banking portal with loan & account management |
| 3 | 💸 **GlobalUnionPay UPI** | 10 Microservices + React TS | Production-grade UPI payment platform like PhonePe / GPay |

---

## ⚡ Quick Start

```bash
git clone https://github.com/Arthikhs/GlobalUnion-Pay.git
cd GlobalUnion-Pay
```

> See individual project sections below for detailed run instructions.

---

## 🛠️ Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| Java | 21+ | [Download](https://adoptium.net) |
| Node.js | 18+ | [Download](https://nodejs.org) |
| Maven | 3.9+ | [Download](https://maven.apache.org) |
| Docker | Latest | [Download](https://www.docker.com) |
| Git | Latest | [Download](https://git-scm.com) |

---

## 📁 Repository Structure

```
GlobalUnion-Pay/
│
├── 🏧 atm-project/                   ATM Simulation — React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ATMMachine.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── 🏦 bank-project/                  Bank Portal — React + Spring Boot
│   ├── src/                          React Frontend (Port 3000)
│   │   ├── components/
│   │   │   ├── BankDetails.js
│   │   │   ├── CreateAccount.js
│   │   │   ├── Deposit.js
│   │   │   ├── FundTransfer.js
│   │   │   ├── LoanDetails.js
│   │   │   ├── CustomerDetails.js
│   │   │   ├── ATMCard.js
│   │   │   └── ATMMachine.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   └── LoginPage.js
│   │   ├── AccountContext.js
│   │   ├── TransactionContext.js
│   │   └── api.js
│   ├── backend/                      Spring Boot Backend (Port 8080)
│   │   └── src/main/java/com/globalunion/pay/
│   │       ├── controller/
│   │       ├── model/
│   │       ├── repository/
│   │       ├── security/             JWT + Spring Security
│   │       ├── DataSeeder.java
│   │       └── PayApplication.java
│   └── package.json
│
└── 💸 globalunionpay-upi/            UPI Platform — Microservices + React TS
    ├── backend/
    │   ├── api-gateway/              Port 8080
    │   ├── auth-service/             Port 8081
    │   ├── user-service/             Port 8082
    │   ├── upi-service/              Port 8083
    │   ├── payment-service/          Port 8084
    │   ├── wallet-service/           Port 8085
    │   ├── transaction-service/      Port 8086
    │   ├── notification-service/     Port 8087
    │   ├── fraud-service/            Port 8088
    │   ├── analytics-service/        Port 8089
    │   └── merchant-service/
    ├── frontend/                     React 18 + TypeScript + Tailwind (Port 5173)
    ├── docker-compose.yml
    └── pom.xml                       Parent Maven POM
```

---

## 🏧 ATM Simulation

A realistic ATM machine simulation built with React.js that mimics real ATM behavior.

### ✨ Features

- 💳 Card insert & eject animation flow
- 🔢 Secure PIN authentication with masked input
- 💰 Cash withdrawal with denomination selection
- 🏦 Balance enquiry with account summary
- 📋 Mini statement — last 5 transactions
- 📌 PIN change with confirmation

### ▶️ Run

```bash
cd atm-project
npm install
set PORT=3001 && npm start
```

🌐 Open → `http://localhost:3001`

---

## 🏦 Bank Portal

A full-stack employee banking portal with React.js frontend and Spring Boot REST API backend, secured with JWT authentication.

### ✨ Features

- 🔐 JWT-based employee login with split-screen UI
- 🏦 Bank overview — balance, IFSC, branch, revenue dashboard
- 👤 Create, edit & delete customer accounts
- 💰 Deposit & withdrawal with real-time balance validation
- 🔄 Fund transfer with 3-step confirmation flow
- 🧑‍💼 Customer details with per-account transaction history
- 🏛️ Loan management — Education, Business, Vehicle, Agriculture, Property
- 📊 EMI calculator with amortization schedule
- 💳 ATM card generator — generate & download as PDF

### 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Employee ID | `EMP001` |
| Password | `bank@1234` |

### ▶️ Run

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

### 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Employee login → returns JWT |
| `GET` | `/api/accounts` | Get all customer accounts |
| `POST` | `/api/accounts` | Create new account |
| `PUT` | `/api/accounts/{id}` | Update account details |
| `DELETE` | `/api/accounts/{id}` | Delete account |
| `POST` | `/api/transactions/deposit` | Deposit funds |
| `POST` | `/api/transactions/withdraw` | Withdraw funds |
| `POST` | `/api/transactions/transfer` | Fund transfer between accounts |
| `GET` | `/api/transactions/{accountId}` | Get transaction history |
| `GET` | `/api/loans` | Get all loans |
| `POST` | `/api/loans` | Issue new loan |
| `PUT` | `/api/loans/{id}/close` | Close / foreclose loan |

---

## 💸 GlobalUnionPay UPI Platform

A production-grade UPI payment platform inspired by PhonePe, Google Pay, and Razorpay — built with **Java 21 Spring Boot Microservices** and **React 18 TypeScript**.

### ✨ Features

- 📱 PhonePe-style payment flow — Phone/UPI → Validate → Amount → PIN → Success
- 🔔 Real-time notifications via Spring WebSocket + Apache Kafka
- 🛡️ Fraud detection with Spring AOP + Redis pattern analysis
- 📦 Spring Batch for bulk transaction settlement
- ⚡ Redis caching for user profiles, balances, UPI validation
- 🔐 JWT + Spring Security with role-based access control (USER / MERCHANT / ADMIN)
- 🗄️ Flyway database migrations for zero-downtime schema changes
- 🔄 Resilience4j circuit breaker on all inter-service payment calls
- 🚀 GitHub Actions CI/CD pipeline with Docker + AWS EC2 deploy
- 🏪 Merchant portal with QR code generation & settlement management
- 📊 Analytics dashboard with Kafka consumer & Recharts visualization

### 🧩 Microservices Architecture

```
                        ┌─────────────────┐
                        │   API Gateway   │  :8080
                        │  JWT + Routing  │
                        └────────┬────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
   ┌──────▼──────┐       ┌───────▼──────┐      ┌───────▼──────┐
   │Auth Service │       │ User Service │      │  UPI Service │
   │   :8081     │       │    :8082     │      │    :8083     │
   └─────────────┘       └─────────────┘      └─────────────┘
          │                      │                      │
   ┌──────▼──────┐       ┌───────▼──────┐      ┌───────▼──────┐
   │  Payment    │       │   Wallet     │      │ Transaction  │
   │  Service   │       │   Service    │      │   Service    │
   │   :8084     │       │    :8085     │      │    :8086     │
   └─────────────┘       └─────────────┘      └─────────────┘
          │                      │                      │
   ┌──────▼──────┐       ┌───────▼──────┐      ┌───────▼──────┐
   │Notification │       │    Fraud     │      │  Analytics   │
   │  Service   │       │   Service    │      │   Service    │
   │   :8087     │       │    :8088     │      │    :8089     │
   └─────────────┘       └─────────────┘      └─────────────┘
```

| Service | Port | Responsibility |
|---------|------|----------------|
| **API Gateway** | 8080 | Routing, JWT auth filter, rate limiting |
| **Auth Service** | 8081 | JWT tokens, OTP verification, registration |
| **User Service** | 8082 | User profile, KYC, referral system |
| **UPI Service** | 8083 | UPI IDs, VPA management, QR codes |
| **Payment Service** | 8084 | Payment flow, scheduled jobs |
| **Wallet Service** | 8085 | Balance management, add money, deductions |
| **Transaction Service** | 8086 | Transaction history, Spring Batch, PostgreSQL |
| **Notification Service** | 8087 | WebSocket push, Kafka consumer, email/SMS |
| **Fraud Service** | 8088 | Risk scoring, AOP interceptors, pattern detection |
| **Analytics Service** | 8089 | Dashboard stats, Kafka consumer, reporting |
| **Merchant Service** | 8090 | Merchant portal, QR generation, settlements |

### ▶️ Run — Docker (Recommended)

```bash
cd globalunionpay-upi
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:8080 |
| Kafka UI | http://localhost:9000 |

### ▶️ Run — Manual

```bash
# Step 1: Start infrastructure
docker-compose up -d mysql postgres redis zookeeper kafka

# Step 2: Start all backend services
# Run each in a separate terminal
cd globalunionpay-upi/backend/auth-service         && mvn spring-boot:run
cd globalunionpay-upi/backend/user-service         && mvn spring-boot:run
cd globalunionpay-upi/backend/upi-service          && mvn spring-boot:run
cd globalunionpay-upi/backend/payment-service      && mvn spring-boot:run
cd globalunionpay-upi/backend/wallet-service       && mvn spring-boot:run
cd globalunionpay-upi/backend/transaction-service  && mvn spring-boot:run
cd globalunionpay-upi/backend/notification-service && mvn spring-boot:run
cd globalunionpay-upi/backend/fraud-service        && mvn spring-boot:run
cd globalunionpay-upi/backend/analytics-service    && mvn spring-boot:run
cd globalunionpay-upi/backend/api-gateway          && mvn spring-boot:run

# Step 3: Start frontend
cd globalunionpay-upi/frontend
npm install && npm run dev
# → http://localhost:5173
```

### 📖 Swagger API Docs

| Service | Swagger URL |
|---------|-------------|
| Auth Service | http://localhost:8081/swagger-ui.html |
| User Service | http://localhost:8082/swagger-ui.html |
| UPI Service | http://localhost:8083/swagger-ui.html |
| Payment Service | http://localhost:8084/swagger-ui.html |
| Wallet Service | http://localhost:8085/swagger-ui.html |

### 🔧 Environment Variables

```env
# Database
MYSQL_ROOT_PASSWORD=your_mysql_password
POSTGRES_PASSWORD=your_postgres_password

# Security
JWT_SECRET=your_very_long_secret_key_minimum_256_bits

# AWS
AWS_EC2_HOST=your_ec2_public_ip
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🛠️ Tech Stack

### Frontend

| Project | Technology |
|---------|------------|
| ATM Simulation | React.js, JavaScript, CSS Animations |
| Bank Portal | React.js, React Router v6, Context API, jsPDF, Axios |
| UPI Platform | React 18, TypeScript, Tailwind CSS, Zustand, React Query, Framer Motion, Recharts, STOMP.js, Axios |

### Backend

| Layer | Technology |
|-------|------------|
| Language | Java 21 |
| Framework | Spring Boot 3.2 |
| Security | Spring Security 6 + JWT (JJWT) |
| ORM | Spring Data JPA + Hibernate |
| Messaging | Apache Kafka |
| Cache | Redis + Spring Cache |
| Batch Processing | Spring Batch |
| WebSocket | Spring WebSocket + STOMP |
| Circuit Breaker | Resilience4j |
| DB — Bank | H2 (dev) / MySQL (prod) |
| DB — UPI Primary | MySQL 8 |
| DB — UPI Analytics | PostgreSQL 15 |
| DB Migration | Flyway |
| API Docs | OpenAPI 3 / Swagger UI |
| Build Tool | Maven |

### DevOps & Cloud

| Tool | Usage |
|------|-------|
| Docker + Docker Compose | Containerization & local orchestration |
| Kubernetes | Production orchestration |
| GitHub Actions | CI/CD pipeline automation |
| AWS EC2 | Application compute |
| AWS RDS | Managed relational database |
| AWS S3 | File & document storage |
| AWS CloudWatch | Monitoring & logging |

---

## 🖼️ Cloudinary Image Management

Cloudinary is used for image uploads and transformations across the projects.

### Where It's Used

| Project | Usage | Transformation |
|---------|-------|----------------|
| **Bank Portal** | Customer profile photos, loan documents | `fit` — preserves aspect ratio, no crop |
| **UPI Platform** | Merchant logos, QR code thumbnails | `fill` — crops to exact size, fills frame |
| **ATM Simulation** | Not applicable | — |

### Transformations

| Type | Behavior | Used In |
|------|----------|---------|
| `fill` | Crops & fills exact dimensions | UPI merchant logos |
| `fit` | Keeps aspect ratio, no cropping | Bank Portal profile photos |
| `scale` | Stretches to exact size (no crop) | Not used |

### Setup (application.properties)

```properties
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
```

### Upload Service (Spring Boot)

```java
@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    // Bank Portal — fit (profile photos, documents)
    public String uploadFit(MultipartFile file) throws IOException {
        Map result = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap("transformation", "c_fit,w_300,h_300"));
        return result.get("url").toString();
    }

    // UPI Platform — fill (merchant logos, thumbnails)
    public String uploadFill(MultipartFile file) throws IOException {
        Map result = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap("transformation", "c_fill,w_200,h_200"));
        return result.get("url").toString();
    }
}
```

### Environment Variable

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 CI/CD Pipeline

```
Push to main branch
       │
       ▼
  GitHub Actions
       │
       ├── Maven Build (mvn clean package)
       ├── npm Build (npm run build)
       ├── Run Unit Tests
       │
       ▼
  Docker Build & Push
  → GitHub Container Registry (GHCR)
       │
       ▼
  SSH into AWS EC2
  → docker-compose pull
  → docker-compose up -d
       │
       ▼
  ✅ Live on Production
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push to your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request on GitHub
```

---

## 🐛 Issues & Support

Found a bug or have a feature request? [Open an issue](https://github.com/Arthikhs/GlobalUnion-Pay/issues) on GitHub.

---

## 👨‍💻 Developer

<div align="center">

### Arthikhs
**Full Stack Java Developer**

[![GitHub](https://img.shields.io/badge/GitHub-Arthikhs-181717?style=for-the-badge&logo=github)](https://github.com/Arthikhs)

</div>

| Skill Area | Technologies |
|------------|-------------|
| Languages | Java, JavaScript, TypeScript |
| Backend | Spring Boot, Spring Security, Spring Data JPA, Hibernate, REST APIs, JWT, Microservices, Spring Batch, Spring WebSocket, Kafka |
| Frontend | React.js, Next.js, TypeScript, Tailwind CSS, Zustand, React Query |
| Databases | MySQL, PostgreSQL, H2, Redis |
| Cloud & DevOps | Docker, Kubernetes, AWS (EC2, S3, RDS, CloudWatch), GitHub Actions, CI/CD |
| Tools | Git, GitHub, Maven, Postman, Swagger |

---

## 📄 License

This project is built for **educational and portfolio purposes**.

---

<div align="center">

Built with ❤️ by **[Arthikhs](https://github.com/Arthikhs)** | 🔗 **[GlobalUnion-Pay](https://github.com/Arthikhs/GlobalUnion-Pay)**

⭐ **Star this repo if you found it useful!**

</div>
