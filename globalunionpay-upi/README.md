<div align="center">

# 💸 GlobalUnion Pay

### Production-Grade UPI Payment Platform — Java 21 Microservices + React 18 TypeScript

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)](https://kafka.apache.org)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)

<br/>

> Inspired by **PhonePe**, **Google Pay**, and **Razorpay** — Built by **[Arthikhs](https://github.com/Arthikhs)**

</div>

---

## ✨ Features

- 📱 PhonePe-style payment flow — Phone/UPI → Validate → Amount → PIN → Success
- 🔔 Real-time notifications via Spring WebSocket + Apache Kafka
- 🛡️ Fraud detection with Spring AOP + Redis pattern analysis
- 📦 Spring Batch for bulk transaction settlement
- ⚡ Redis caching for user profiles, balances, UPI validation
- 🔐 JWT + Spring Security with role-based access (USER / MERCHANT / ADMIN)
- 🗄️ Flyway database migrations for zero-downtime schema changes
- 🔄 Resilience4j circuit breaker on all inter-service payment calls
- 🚀 GitHub Actions CI/CD pipeline with Docker + AWS EC2 deploy
- 🏪 Merchant portal with QR code generation & settlement management
- 📊 Analytics dashboard with Kafka consumer & Recharts visualization

---

## 🧩 Microservices Architecture

```
                        ┌─────────────────────┐
                        │    API Gateway       │  :8080
                        │  JWT Filter + Rate   │
                        │      Limiting        │
                        └──────────┬──────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
   ┌──────▼──────┐         ┌───────▼──────┐        ┌───────▼──────┐
   │ Auth Service │  :8081  │ User Service │  :8082  │  UPI Service │  :8083
   │ JWT, OTP,   │         │ Profile, KYC │         │ VPA, QR Code │
   │ Registration│         │   Referral   │         │  UPI IDs     │
   └─────────────┘         └─────────────┘         └─────────────┘
          │                        │                        │
   ┌──────▼──────┐         ┌───────▼──────┐        ┌───────▼──────┐
   │  Payment    │  :8084  │   Wallet     │  :8085  │ Transaction  │  :8086
   │  Service    │         │   Service    │         │   Service    │
   │ Razorpay,   │         │ Balance, Add │         │ History,     │
   │ Scheduled   │         │ Money, Deduct│         │ Spring Batch │
   └─────────────┘         └─────────────┘         └─────────────┘
          │                        │                        │
   ┌──────▼──────┐         ┌───────▼──────┐        ┌───────▼──────┐
   │Notification │  :8087  │    Fraud     │  :8088  │  Analytics   │  :8089
   │  Service    │         │   Service    │         │   Service    │
   │ WebSocket,  │         │ Risk Scoring │         │ Dashboard,   │
   │ Kafka, Email│         │ AOP, Patterns│         │ Kafka Stats  │
   └─────────────┘         └─────────────┘         └─────────────┘
                                   │
                        ┌──────────▼──────────┐
                        │   Merchant Service   │
                        │  QR Gen, Settlements │
                        └─────────────────────┘
```

---

## 🗂️ Project Structure

```
globalunionpay-upi/
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
│   ├── merchant-service/
│   └── pom.xml                   Parent Maven POM
├── frontend/                     React 18 + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/                Zustand state management
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml
└── docker-compose.yml
```

---

## 🛠️ Tech Stack

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
| DB — Primary | MySQL 8 |
| DB — Analytics | MySQL 8 |
| DB Migration | Flyway |
| API Docs | OpenAPI 3 / Swagger UI |
| Build Tool | Maven |

### Frontend

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Data Fetching | React Query (TanStack) |
| Charts | Recharts |
| Animations | Framer Motion |
| HTTP | Axios |
| WebSocket | STOMP.js + SockJS |

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

## ▶️ Quick Start

### Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+
- Docker & Docker Compose

### Run with Docker (Recommended)

```bash
cd globalunionpay-upi
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:8080 |
| Kafka UI | http://localhost:9000 |

### Run Manually

```bash
# Step 1 — Start infrastructure
docker-compose up -d mysql redis zookeeper kafka

# Step 2 — Start backend services
cd backend/auth-service         && mvn spring-boot:run &
cd backend/user-service         && mvn spring-boot:run &
cd backend/upi-service          && mvn spring-boot:run &
cd backend/payment-service      && mvn spring-boot:run &
cd backend/wallet-service       && mvn spring-boot:run &
cd backend/transaction-service  && mvn spring-boot:run &
cd backend/notification-service && mvn spring-boot:run &
cd backend/fraud-service        && mvn spring-boot:run &
cd backend/analytics-service    && mvn spring-boot:run &
cd backend/api-gateway          && mvn spring-boot:run

# Step 3 — Start frontend
cd frontend
npm install && npm run dev
# → http://localhost:5173
```

---

## 🔌 Service Ports

| Service | Port |
|---------|------|
| Frontend | 5173 (dev) / 80 (prod) |
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
| MySQL | 3306 |
| Redis | 6379 |
| Kafka | 9092 |
| Kafka UI | 9000 |

---

## 📖 Swagger API Docs

| Service | URL |
|---------|-----|
| Auth Service | http://localhost:8081/swagger-ui.html |
| User Service | http://localhost:8082/swagger-ui.html |
| UPI Service | http://localhost:8083/swagger-ui.html |
| Payment Service | http://localhost:8084/swagger-ui.html |
| Wallet Service | http://localhost:8085/swagger-ui.html |

---

## 🔧 Environment Variables

```env
# Database
MYSQL_ROOT_PASSWORD=your_mysql_password

# Security
JWT_SECRET=your_very_long_secret_key_minimum_256_bits

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AWS
AWS_EC2_HOST=your_ec2_public_ip
AWS_ACCESS_KEY_ID=<your_access_key>
AWS_SECRET_ACCESS_KEY=<your_secret_key>
AWS_S3_BUCKET=your_bucket_name

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🚀 CI/CD Pipeline

```
Push to main
      │
      ▼
GitHub Actions
      │
      ├── Maven Build (mvn clean package)
      ├── npm Build (npm run build)
      ├── Run Unit Tests
      │
      ▼
Docker Build & Push → GHCR
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

## 📄 License

Built for **educational and portfolio purposes**.

---

<div align="center">

Built with ❤️ by **[Arthikhs](https://github.com/Arthikhs)**

⭐ Star this repo if you found it useful!

</div>
