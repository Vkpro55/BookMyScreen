# 🎬 BookMyScreen - Movie Booking System

A full-stack movie ticket booking platform built with **React, Node.js, MongoDB, and Express**. Handles thousands of concurrent users with real-time seat locking, OTP authentication, and payment processing.

---

## 🎯 What is BookMyScreen?

BookMyScreen is a complete movie ticket booking system where users can:

- Browse movies and showtimes across multiple theatres
- Select and reserve seats in real-time
- Pay securely and receive booking confirmations
- Manage bookings and view history

**Key Challenge Solved:** Preventing double-booking when thousands of users try to book the same seat simultaneously. Solution: WebSocket-based real-time seat locking.

Live on: https://bookmyscreen.publicvm.com/

To see the OpenAPI docs: https://apibookmyscreen.publicvm.com/api-docs/

---

## ✨ Core Features

| Feature                    | How It Works                                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Real-Time Seat Locking** | WebSockets sync seat status instantly across all clients. Booked seats auto-release after 30 seconds if payment fails |
| **OTP Authentication**     | Time-based one-time password login. No passwords to remember. JWT tokens for secure sessions                          |
| **Payment Processing**     | Simulated payment gateway with transaction logging, refund workflows, and invoice generation                          |
| **Theatre Management**     | Multiple theatres grouped by location. Each theatre has different seat layouts and show timings                       |
| **Responsive UI**          | Mobile-first design with toast notifications, modals, and interactive seat selection                                  |
| **Booking History**        | Track all bookings, cancellations, and refunds in one place                                                           |

---

## 🛠 Tech Stack

```
FRONTEND              BACKEND              DATABASE             DEVOPS
┌──────────────┐      ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ React 18     │      │ Node.js      │     │              │     │ Docker       │
│ TypeScript   │      │ Express      │     │ Prisma ORM   │     │ Aws EC2      │
│ Vite         │      │ TypeScript   │     │              │     │              │
│ WebSocket    │      │ WebSocket    │     │              │     │              │
└──────────────┘      └──────────────┘     └──────────────┘     └──────────────┘
                            ↓
                      ┌──────────────┐
                      │ Redis        │
                      │ (Caching &   │
                      │ Sessions)    │
                      └──────────────┘
```

**Why these choices?**

- **React + TypeScript:** Type safety, reusable components, fast development
- **Node.js + Express:** Non-blocking I/O handles concurrent requests efficiently
- **Websocket:** Bi-directional communication for real-time seat updates
- **Postgresql + Prisma:** Flexible schema + type-safe queries with migrations
- **Redis:** Lightning-fast session storage and real-time data caching with ttl
- **Docker:** Consistent environments (dev, test, production)
- **Turborepo:** Monorepo structure for shared code (types, configs, UI components)

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended - 2 Commands!)

**Requirements:** Docker Desktop

```bash
# Clone and start everything
git clone https://github.com/yourusername/bookmyscreen.git
cd bookmyscreen
docker-compose up --build
```

**That's it!** Services will be ready at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/v1/api
- Postgres, Redis: Running in containers

**Useful commands:**

```bash
docker-compose down              # Stop services
```

---

### Option 2: Local Development

**Requirements:** Node.js 18+, Postgresql, Redis

```bash
# Install dependencies
pnpm install

# Create environment files
# apps/backend/.env:
# DATABASE_URL=mongodb://localhost:27017/bookmyscreen
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=your_secret_key
# PORT=5000

# apps/frontend/.env:
# VITE_API_URL=http://localhost:5400/v1/api

# Setup database
pnpm db:migrate
pnpm db:seed

# Start services (in separate terminals)
cd apps/backend && pnpm dev    # :5000
cd apps/frontend && pnpm dev   # :5173
```

---

### Option 3: All at Once with Turborepo

```bash
pnpm dev
```

Starts backend, frontend, and watches shared packages in parallel.

---

## 📚 Project Structure

| Folder                          | Purpose                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| `apps/backend/src/modules/`     | Feature-specific logic (auth, booking, payment, theatre, show) |
| `apps/backend/src/middlewares/` | Request validation, auth checks, error handling                |
| `apps/backend/src/socket/`      | Real-time WebSocket handlers for seat updates                  |
| `apps/frontend/src/components/` | Reusable React components (buttons, cards, modals)             |
| `apps/frontend/src/pages/`      | Full page layouts (home, booking, profile, etc.)               |
| `apps/frontend/src/context/`    | Global state management (user auth, bookings)                  |
| `packages/db/prisma/`           | Database schema and migrations                                 |
| `docker/`                       | Dockerfile configurations for backend and frontend             |

---

## 🔐 Security & Performance

| Aspect                | Implementation                                                          |
| --------------------- | ----------------------------------------------------------------------- |
| **Authentication**    | OTP-based login → JWT tokens → Redis session storage                    |
| **Authorization**     | Role-based access (admin/customer) via middleware                       |
| **Real-time Updates** | WebSockets prevent polling overhead, reduce server load                 |
| **Concurrency**       | Temporary seat locks (30 sec timeout) prevent double-booking            |
| **Database**          | Prisma ORM prevents SQL injection via parameterized queries             |
| **Caching**           | Redis stores sessions, user data, seat status for lightning-fast access |

---

**Built to demonstrate enterprise-grade full-stack development** 🚀
https://excalidraw.com/#json=utwNBR4mHJGrSyuzAuk10,ivJkiecxc2TZqOpQEnjnzw
