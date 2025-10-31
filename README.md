# Dance Class Booking API

A simple **Fastify + Prisma + TypeScript** API for managing dance class sessions, templates, and bookings.

## ⚙️ Setup & Running Locally

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run migrations

```bash
npx prisma generate
```

```bash
npx prisma migrate dev --name init
```

### 3️⃣ Seed (optional)

```bash
npx ts-node prisma/seed.ts
```

### 4️⃣ Start the server

```bash
npm run dev
```

Server will start at:  
👉 **http://localhost:3000**

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
