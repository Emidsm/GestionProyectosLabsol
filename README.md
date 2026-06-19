# GPL — Gestión de Proyectos Labsol

Full-stack project-matching platform built as a volunteer contribution for **Labsol** (the free-software lab of Zacatecas, a division of [COZCYT](https://cozcyt.gob.mx/)). It connects companies and researchers with university students through a structured proposal-to-enrollment pipeline, backed by real-time WebSocket notifications that scale horizontally via a Redis pub/sub adapter.

---

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat&logo=next.js)
![Express](https://img.shields.io/badge/Express_5-gray?style=flat&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma)
![Socket.io](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io)
![Redis](https://img.shields.io/badge/Redis_7-DC382D?style=flat&logo=redis&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-C72E49?style=flat&logo=minio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## Features

### Three-role RBAC enforced at the routing layer
Three user types — `administrator`, `solicitante` (company/researcher), and `estudiante` (student) — each get an isolated route namespace (`/administrador/*`, `/solicitante/*`, `/estudiante/*`). Role guards run inside Next.js middleware before any page component loads, so unauthorized users are redirected without a backend round-trip.

### Six-stage project lifecycle with status audit trail
Projects flow through `borrador → en_revision → validado → en_curso → finalizado` (or `rechazado`). Every admin transition creates a `ProjectFeedback` record storing the message, previous status, and new status — giving solicitantes a full history of why their submission was reviewed each way.

### Real-time notifications with horizontally scalable WebSocket
Socket.IO shares the same `http.Server` as Express. Each connection authenticates via JWT at the WebSocket handshake (same secret as the REST API), then joins a private user room (`user:<id>`). The `@socket.io/redis-adapter` pub/sub layer ensures notifications reach users regardless of which backend instance they are connected to.

### Self-hosted object storage
Project image uploads go to a MinIO instance (S3-compatible API) rather than a third-party bucket. Multer validates the upload on the backend, the object is stored in MinIO, and a permanent URL is returned. All data stays within the deployment environment.

### INEGI geographic catalog
All 32 Mexican states and their ~2,400 municipalities are loaded from a local JSON file at `prisma db seed` time and served read-only from PostgreSQL. Student profiles use live cascading dropdowns (state → municipality) backed by this catalog instead of free-text fields.

### Admin-managed academic catalog
The career catalog is a Prisma-backed CRUD resource (`/api/catalog/carreras`), editable by admins at runtime. Changes appear immediately in student registration and profile forms without a deployment.

### Enrollment management with capacity control
Students apply to projects; admins accept or reject applications one by one. Each project has a configurable `studentLimit`. Admins can also force-enroll a student by email for edge cases. Every acceptance or rejection fires a real-time notification to the affected student.

---

## Tech Stack

| Layer             | Technology                                        |
|-------------------|---------------------------------------------------|
| Frontend          | Next.js 15 (App Router, Turbopack), React 18      |
| UI components     | shadcn/ui (Radix UI primitives) + Tailwind CSS    |
| Forms / validation| react-hook-form + Zod                             |
| Charts            | Recharts                                          |
| Backend           | Express 5, TypeScript, tsx (hot-reload)           |
| ORM               | Prisma 5 (migrations + typed client)              |
| Database          | PostgreSQL 15                                     |
| Real-time         | Socket.IO 4 + `@socket.io/redis-adapter`          |
| Cache / pub-sub   | Redis 7                                           |
| Object storage    | MinIO (S3-compatible, self-hosted)                |
| Auth              | JWT (shared between REST API and WebSocket)       |
| Security          | Helmet, express-rate-limit, bcryptjs              |
| Logging           | Winston                                           |
| Email             | Nodemailer (SMTP)                                 |
| Infrastructure    | Docker Compose (all services containerized)       |

---

## Architecture

```
Browser (Next.js 15)
     │
     │  REST (JWT Bearer)        WebSocket (JWT handshake)
     ▼                           ▼
┌────────────────────────────────────────────────────┐
│               Express 5 + Socket.IO                │
│  ┌───────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  REST API │  │ Socket Server│  │   Multer    │ │
│  │  /api/... │  │ (JWT verify) │  │  (uploads)  │ │
│  └─────┬─────┘  └──────┬───────┘  └──────┬──────┘ │
└────────┼───────────────┼─────────────────┼─────────┘
         │               │                 │
         ▼               ▼                 ▼
   ┌──────────┐    ┌──────────┐     ┌──────────┐
   │PostgreSQL│    │  Redis   │     │  MinIO   │
   │  Prisma  │    │ pub/sub  │     │  (S3)    │
   └──────────┘    └──────────┘     └──────────┘
```

The WebSocket server and REST API share the same `http.Server` instance. The Redis adapter means a notification emitted by one backend pod is fanned out to users connected to any other pod — horizontal scaling requires no application-level changes.

---

## Getting Started

### Prerequisites

- Docker + Docker Compose (nothing else required locally)

### 1. Configure the backend environment

```bash
cp Backend/.env.example Backend/.env
# Edit Backend/.env — set JWT_SECRET at minimum; all other defaults work for local Docker
```

### 2. Start all services

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Brings up PostgreSQL, Redis, MinIO, the Express backend, and the Next.js frontend.

### 3. Run migrations

```bash
docker exec -it gestion-backend npx prisma migrate deploy
```

### 4. Seed the database (run once)

```bash
docker exec -it gestion-backend npx prisma db seed
```

Creates the default admin account, loads the full INEGI state/municipality catalog, and populates the base career catalog. The seed uses `upsert` for the admin and careers so it is safe to re-run, but demo project data will duplicate — run it once.

### Local service URLs

| Service        | URL                       |
|----------------|---------------------------|
| Web app        | http://localhost:9002     |
| Backend API    | http://localhost:3001     |
| MinIO console  | http://localhost:9003     |
| Prisma Studio  | http://localhost:5555 *   |

\* Start with `docker exec -it gestion-backend npx prisma studio`

### Default credentials

| Role          | Email                       | Password  |
|---------------|-----------------------------|-----------|
| Administrator | admin@labsol.mx             | admin123  |
| Solicitante   | contacto@techsolutions.com  | admin123  |
| Estudiante    | emiliano@uaz.edu.mx         | admin123  |

---

## Project Structure

```
.
├── docker-compose.dev.yml          # Orchestrates all 5 services for local dev
│
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Data model: User, Project, Enrollment, Notification, catalogs
│   │   ├── migrations/             # Prisma migration history
│   │   ├── seed.ts                 # Admin + INEGI catalog + demo data
│   │   └── data/
│   │       └── estados-municipios.json   # INEGI source (32 states, ~2,400 municipalities)
│   └── src/
│       ├── app.ts                  # Express app setup and route registration
│       ├── server.ts               # HTTP server bootstrap, Socket.IO init, MinIO init
│       ├── config/
│       │   ├── database.ts         # Prisma client singleton
│       │   ├── socket.ts           # Socket.IO: JWT auth middleware + Redis adapter
│       │   └── minio.ts            # MinIO client init and bucket creation
│       ├── controllers/            # Request handlers per resource
│       ├── middlewares/            # verifyToken, isAdmin
│       ├── routes/                 # Express router definitions per resource
│       └── services/
│           └── minio.service.ts    # Upload and URL generation logic
│
└── Frontend/
    └── src/
        ├── middleware.ts           # Next.js RBAC: role-based route protection
        ├── app/
        │   ├── page.tsx            # Login page
        │   ├── register/           # Student and solicitante self-registration
        │   └── (app)/
        │       ├── administrador/  # Admin views: requests, projects, users, career catalog
        │       ├── solicitante/    # Solicitante views: submit and track project proposals
        │       └── estudiante/     # Student views: browse and enroll in projects
        ├── components/
        │   ├── ui/                 # shadcn/ui primitives
        │   └── NotificationsPopover.tsx   # Real-time notification bell (Socket.IO client)
        └── lib/
            ├── api.ts              # Typed REST client and shared TypeScript interfaces
            └── socket.ts           # Socket.IO client singleton
```
