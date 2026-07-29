# GlobalUnion Pay – FinTech UPI Payment Platform

A production-grade, enterprise-level UPI payment platform built with **Java 21 + Spring Boot Microservices** backend and **React.js + TypeScript** frontend. Inspired by PhonePe, Google Pay, and Razorpay.

---

## Tech Stack

### Backend (Java Full Stack)
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

---

## Microservices Architecture

```
API Gateway (8080)
├── Auth Service       (8082) – JWT, OTP, Spring Security
├── User Service       (8083) – Profile, KYC, Referral
├── UPI Service        (8084) – UPI IDs, VPA, QR, Payments
├── Payment Service    (8085) – Payment flow, Razorpay, Scheduled
├── Wallet Service     (8086) – Balance, Add Money, Deduct
├── Transaction Service(8087) – History, Spring Batch, PostgreSQL
├── Notification Svc   (8090) – WebSocket, Kafka Consumer
├── Fraud Service      (8091) – Risk scoring, AOP, Pattern detection
├── Merchant Service   (8088) – Merchant portal, Settlements
└── Analytics Service  (8089) – Dashboard stats, Kafka consumer
```

---

## Quick Start

### Prerequisites
- Java 21
- Maven 3.9+
- Node.js 20+
- Docker & Docker Compose
- MySQL 8 running on port 3306
- PostgreSQL 15 running on port 5432
- Redis running on port 6379
- Kafka running on port 9092

### Run with Docker Compose (Recommended)
```bash
docker-compose up -d
```
This starts: MySQL, PostgreSQL, Redis, Zookeeper, Kafka, all backend services, and frontend.

### Run Backend Services Manually
```bash
# Auth Service
cd backend/auth-service
mvn spring-boot:run

# UPI Service
cd backend/upi-service
mvn spring-boot:run

# Payment Service
cd backend/payment-service
mvn spring-boot:run

# (repeat for each service)
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:5173

---

## Service Ports

| Service | Port |
|---|---|
| Frontend | 5173 (dev) / 80 (prod) |
| API Gateway | 8080 |
| Auth Service | 8082 |
| User Service | 8083 |
| UPI Service | 8084 |
| Payment Service | 8085 |
| Wallet Service | 8086 |
| Transaction Service | 8087 |
| Merchant Service | 8088 |
| Analytics Service | 8089 |
| Notification Service | 8090 |
| Fraud Service | 8091 |
| MySQL | 3306 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| Kafka | 9092 |

---

## API Documentation

Each service exposes Swagger UI:
- Auth: http://localhost:8082/swagger-ui.html
- UPI: http://localhost:8084/swagger-ui.html
- Payment: http://localhost:8085/swagger-ui.html
- User: http://localhost:8083/swagger-ui.html

---

## Key Features

- **PhonePe-style payment flow** – Enter phone/UPI → Validate → Amount → PIN → Success
- **Real-time notifications** via Spring WebSocket + Kafka
- **Fraud detection** with Spring AOP + Redis pattern analysis
- **Spring Batch** for bulk transaction settlement
- **Redis caching** for user profiles, balances, UPI validation
- **JWT + Spring Security** with role-based access control
- **Flyway** database migrations
- **Resilience4j** circuit breaker on payment calls
- **GitHub Actions** CI/CD pipeline with Docker build + AWS deploy

---

## CI/CD Pipeline

```
Push to main
    ↓
GitHub Actions
    ↓
Build all Spring Boot services (Maven)
    ↓
Build React frontend (npm)
    ↓
Docker build & push to GHCR
    ↓
SSH deploy to AWS EC2
    ↓
docker-compose up -d
```

---

## Environment Variables

Copy and configure for production:
```env
MYSQL_ROOT_PASSWORD=your_password
POSTGRES_PASSWORD=your_password
JWT_SECRET=your_very_long_secret_key
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
AWS_EC2_HOST=your_ec2_ip
```
