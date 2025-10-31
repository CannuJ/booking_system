# 💃 Dance Class Booking API (MVP)

A simple **Fastify + Prisma + TypeScript** API for managing dance class templates, sessions, and bookings.  
This project follows **Domain-Driven Design** and a **Hexagonal (Ports & Adapters)** architecture.

---

## 🚀 Features

- **Fastify** for high-performance HTTP routing
- **Prisma ORM** for type-safe database access
- **SQLite** persistence for local development
- **Layered architecture** with clear separation between Domain, Application, Infrastructure, and Interfaces
- **Transactional safety** to prevent overbooking
- **Ready for AWS Lambda / Serverless Framework integration**

---

## ⚙️ Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Setup environment

Create a `.env` file:

```bash
DATABASE_URL="file:/dev.db"
PORT=3000
```

### 3️⃣ Migrate database

```bash
npx prisma migrate dev --name init
```

### 4️⃣ Seed (optional)

```bash
npx prisma db seed
```

### 5️⃣ Run locally

```bash
npm run dev
```

Server runs at **http://localhost:3000**

---

## 🧭 API Routes

### `GET /templates`

Returns available dance class templates.  
**Query params:**

- `type` (optional): `"salsa" | "bachata" | "reggaeton" | "any"`

**Example:**

```bash
curl http://localhost:3000/templates?type=salsa
```

---

### `GET /sessions`

List all active sessions or details of a specific session.

**Example:**

```bash
curl http://localhost:3000/sessions
```

---

### `POST /bookings/:sessionId`

Book a class by email.

**Request Body:**

```json
{
	"email": "user@example.com"
}
```

**Rules:**

- ✅ Creates booking if spots remain
- ❌ Returns 409 if full
- ❌ Returns 409 if email already booked

**Example:**

```bash
curl -X POST http://localhost:3000/bookings/1   -H "Content-Type: application/json"   -d '{"email": "user@example.com"}'
```

---

## 🧩 Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| **Runtime**      | Node.js / Fastify            |
| **Language**     | TypeScript                   |
| **ORM**          | Prisma                       |
| **Database**     | SQLite                       |
| **Architecture** | Hexagonal (Ports & Adapters) |
| **Validation**   | TypeScript interfaces        |

---

## 🧱 Future Improvements / TODOs

- [ ] **Implement typed DTOs** for all API endpoints
- [ ] **Integrate Serverless Framework (AWS Lambda)**
- [ ] **Complete Error formats**
- [ ] **Add Fastify JSON Schemas**
- [ ] **Add unit tests**
