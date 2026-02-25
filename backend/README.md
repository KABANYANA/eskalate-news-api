# Eskalate News API

Production-ready RESTful API built with Node.js, TypeScript, PostgreSQL, Prisma, and BullMQ.

This system enables Authors to publish content and Readers to consume it.
It includes non-blocking read tracking and a Redis-backed analytics engine that aggregates daily engagement metrics in GMT.

---

## 🚀 Core Features

- Secure user registration with strong password validation
- JWT-based authentication with role claims
- Role-Based Access Control (Author / Reader)
- Author-only article management (create, update, soft delete)
- Public news feed with filtering & pagination
- Non-blocking read tracking
- Redis-backed BullMQ analytics processing
- Daily GMT-based aggregation of view counts
- Author performance dashboard with aggregated metrics
- Unit testing with Prisma mocking

---

## 🏗 Architecture Overview

The application follows a layered architecture:

Routes → Controllers → Services → Prisma (Database)

Key architectural decisions:

- Soft Delete Strategy: Articles are not physically deleted to preserve analytics integrity.
- Non-Blocking Read Logging: Read logs are written asynchronously to prevent request latency.
- Queue-Based Analytics: Daily aggregation is processed through BullMQ to decouple heavy computation from HTTP requests.
- GMT Aggregation: Ensures consistent cross-timezone daily reporting.

---

## 🛠 Technology Stack

- Node.js + TypeScript
- Express
- PostgreSQL
- Prisma ORM
- BullMQ + Redis
- JWT
- Jest + Supertest

---

## 📦 Local Setup

### 1️⃣ Install Dependencies

npm install

### 2️⃣ Configure Environment Variables

Create a `.env` file:

DATABASE_URL="postgresql://postgres:@localhost:5432/escalate_news"

JWT_SECRET="your_secret_key"

### 3️⃣ Run Database Migration

npx prisma migrate dev

### 4️⃣ Start Redis

redis-server

### 5️⃣ Start Development Server

npm run dev

---

## 🧪 Run Tests

npm run test

---

## 📊 Analytics Engine

Read logs are stored in real time.
A BullMQ worker processes logs and aggregates view counts per article per GMT day into the DailyAnalytics table.

The Author Dashboard endpoint sums aggregated data for performance reporting.

---

## 🔐 Security Measures

- Passwords hashed using bcrypt
- JWT tokens include sub and role claims
- Role-based authorization middleware
- Soft-deleted records excluded from public endpoints

---

## 📂 Project Structure

src/
  controllers/
  services/
  routes/
  middlewares/
  queues/
  validators/
  test/

---

## 👤 Author

Joyeuse
