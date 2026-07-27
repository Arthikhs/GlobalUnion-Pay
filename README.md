# 🏦 GlobalUnion Pay — FinTech Payment Platform

A modern, enterprise-grade Employee Banking Portal & FinTech Payment Platform built with **React.js** and **Spring Boot**, designed for internal bank employee use with secure login and full core banking operations.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, JavaScript |
| Routing | React Router DOM v6 |
| Styling | Plain CSS (custom) |
| State | React Hooks, Context API |
| Backend | Java 21, Spring Boot |
| Security | Spring Security, JWT Authentication |
| ORM | Spring Data JPA, Hibernate |
| Database | H2 (dev), MySQL / PostgreSQL (prod) |
| Cache | Redis |
| Messaging | Apache Kafka |
| Cloud | AWS (EC2, S3, RDS) |
| DevOps | Docker, Kubernetes, GitHub Actions, CI/CD |
| Testing | JUnit, Postman |
| Version Control | Git & GitHub |

---

## ✨ Features

- 🔐 **Secure Login** — Employee ID & Password authentication (split-screen UI) with JWT
- 🏦 **Bank Details** — View account balance, IFSC, branch, revenue & transaction overview
- 👤 **Create & Edit Account** — Open savings/current accounts, edit or delete existing accounts
- 💰 **Deposit & Withdrawal** — Deposit or withdraw funds with real-time balance validation
- 🔄 **Fund Transfer** — Instant account-to-account fund transfer with 3-step confirmation flow
- 🧑‍💼 **Customer Details** — View all customers, full profile, and per-account transaction history
- 🏛️ **Loan Details** — Issue & manage Education, Business, Vehicle, Agriculture, Property loans with EMI calculator
- 💳 **Generate ATM Card** — Generate and download ATM card PDF for any customer
- 📱 **Responsive Design** — Optimized for desktop/laptop

---

## 🖥️ Screenshots

### Login Page
- Left panel: SecureBank branding & logo
- Right panel: Employee ID + Password login form

### Dashboard
- Top navbar with employee greeting & logout
- 7 feature cards: Bank Details, Deposit & Withdrawal, Create & Edit Account, Customer Details, Loan Details, Generate ATM Card, Fund Transfer

---

## 🛠️ Getting Started

### Prerequisites
- Node.js >= 14.x
- npm >= 6.x
- Java 17+
- Maven

### Frontend

```bash
# Clone the repository
git clone https://github.com/Arthikhs/GlobalUnion-Pay.git

# Navigate to project folder
cd GlobalUnion-Pay

# Install dependencies
npm install

# Start development server
npm start
```

App runs at `http://localhost:3000`

### Backend

```bash
cd backend
mvn spring-boot:run
```

API runs at `http://localhost:8080`

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Employee ID | `EMP001` |
| Password | `bank@1234` |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── BankDetails.js       # Account info & transaction overview
│   ├── CreateAccount.js     # Create / Edit / Delete account
│   ├── Deposit.js           # Deposit & Withdrawal
│   ├── FundTransfer.js      # Account-to-account fund transfer
│   ├── CustomerDetails.js   # Customer list & profile view
│   ├── LoanDetails.js       # Loan issuance & management
│   ├── ATMCard.js           # ATM card generator & PDF download
│   └── ATMMachine.js        # ATM simulation
├── pages/
│   ├── LoginPage.js         # Split-screen login
│   └── Dashboard.js         # Main dashboard + navbar
├── App.js                   # Routes
├── api.js                   # All API calls
├── AccountContext.js        # Account state context
├── TransactionContext.js    # Transaction state context
├── index.js                 # Entry point
└── index.css                # Global styles

backend/
└── src/main/java/com/globalunion/pay/
    ├── controller/
    │   ├── AuthController.java
    │   ├── AccountController.java
    │   ├── TransactionController.java
    │   └── LoanController.java
    ├── model/
    │   ├── Account.java
    │   ├── Employee.java
    │   ├── Transaction.java
    │   └── Loan.java
    ├── repository/
    ├── security/
    │   ├── JwtUtil.java
    │   ├── JwtFilter.java
    │   └── SecurityConfig.java
    ├── DataSeeder.java
    └── PayApplication.java
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Employee login |
| GET | `/api/accounts` | Get all accounts |
| POST | `/api/accounts` | Create account |
| GET | `/api/accounts/by-number/{acc}` | Get account by number |
| PUT | `/api/accounts/{id}` | Update account |
| DELETE | `/api/accounts/{id}` | Delete account |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions/deposit` | Deposit funds |
| POST | `/api/transactions/withdraw` | Withdraw funds |
| POST | `/api/transactions/transfer` | Fund transfer |
| GET | `/api/loans` | Get all loans |
| POST | `/api/loans` | Issue loan |
| PUT | `/api/loans/{id}/close` | Close loan |

---

## 👨‍💻 Developer

**Arthikhs** — Full Stack Java Developer

- **Languages:** Java, JavaScript, TypeScript
- **Backend:** Spring Boot, Spring Security, Spring Data JPA, Hibernate, REST APIs, JWT Authentication, Microservices, Spring Batch, Spring WebSocket
- **Frontend:** React.js, Next.js, Tailwind CSS
- **Databases:** MySQL, PostgreSQL, Redis
- **Messaging:** Apache Kafka
- **Cloud & DevOps:** Docker, Kubernetes, AWS (EC2, S3, RDS), GitHub Actions, CI/CD
- **Testing & Tools:** Git, GitHub, JUnit, Postman
- **Core CS:** OOP, Data Structures & Algorithms, DBMS, Operating Systems, System Design

---

## 🏗️ Architecture (Microservices Vision)

```
React.js Frontend
       ↓
Spring Boot API Gateway
       ↓
┌──────────────────────────────────────┐
│  Auth Service  │  User Service       │
│  Wallet Service│  UPI Service        │
│  Bank Service  │  Payment Service    │
│  Transaction   │  Notification       │
│  Reward Service│  Merchant Service   │
│  Analytics     │  Fraud Detection    │
└──────────────────────────────────────┘
       ↓              ↓
  Redis Cache    Apache Kafka
       ↓
  MySQL / PostgreSQL
       ↓
  AWS (EC2, RDS, S3)
```

---

## 📄 License

This project is for educational and portfolio purposes.

---

> Built with ❤️ by Arthikhs — GlobalUnion Pay
