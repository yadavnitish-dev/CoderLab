# AlgoPrep

[![Project Version](https://img.shields.io/badge/version-1.0.4-emerald.svg)](https://github.com/yadavnitish-dev/AlgoPrep)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/stack-TS--Node--React-black.svg)](https://github.com/yadavnitish-dev/AlgoPrep)

**AlgoPrep** is a high-performance, full-stack platform designed for mastering Data Structures and Algorithms. It provides a specialized environment for technical interview preparation, focusing on structured progression through the NeetCode 150 roadmap and secure, self-hosted code execution.

Built for engineers who value precision and discipline, AlgoPrep eliminates the distractions of typical learning platforms to provide a focused "Lab" environment.

---

## 🚀 Key Features

*   **Self-Hosted Execution Engine:** Secure, sandboxed code execution (Python, Java, C++, JavaScript) powered by a local Judge0 instance.
*   **Curated Roadmap:** A non-negotiable, structured path through the NeetCode 150, categorized by topic and difficulty.
*   **Mastery Analytics:** High-density telemetry showing completion rates, percentile rankings, and daily consistency metrics.
*   **Custom Playlists:** Ability to organize problems into custom collections for focused practice sessions.
*   **Professional Workspace:** Features the Monaco Editor (VS Code core) with custom themes designed for long-form coding sessions.
*   **Administrative Suite:** Robust tools for problem creation, test case management, and boilerplate generation.

---

## 🏗️ System Architecture

AlgoPrep utilizes a robust microservices architecture centered around a self-hosted sandboxed execution environment.

```mermaid
graph TD
    User((User)) --> Frontend[React 19 / Vite]
    Frontend --> API[Express API Server]
    API --> DB[(PostgreSQL / Prisma)]
    API --> J0[Judge0 Service Stack]
    J0 --> Workers[Sandboxed Workers]
    Workers --> Results[Execution Feedback]
    Results --> Frontend
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** TailwindCSS 4 + DaisyUI 5
- **State Management:** Zustand
- **Editor:** Monaco Editor
- **Routing:** React Router 7

### Backend
- **Runtime:** Node.js (TypeScript)
- **Framework:** Express
- **ORM:** Prisma 6
- **Authentication:** JWT with Secure HTTP-only Cookies

### Infrastructure & Services
- **Database:** PostgreSQL
- **Caching:** Redis (Global & Judge0)
- **Execution:** Judge0 (Self-hosted via Docker)
- **Email:** Resend SDK

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v20.x or higher)
- **Docker & Docker Compose** (Required for Database and Judge0)
- **Git**

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/yadavnitish-dev/AlgoPrep.git
cd AlgoPrep
```

### 2. Deploy Infrastructure (Docker)
AlgoPrep requires a running Judge0 instance. You can deploy the complete stack (Postgres, Redis, Judge0) using Docker:

```bash
# Deploy Judge0 and Database
# (Ensure you have a Judge0 deployment configuration)
docker-compose up -d
```

### 3. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/algoprep"
JWT_SECRET="your_secure_secret"
JUDGE0_URL="http://localhost:2358"
RESEND_API_KEY="your_resend_key"
FRONTEND_URL="http://localhost:5173"
```

### 4. Database Migration
```bash
cd backend
npx prisma migrate dev
```

### 5. Launching the Application
```bash
# Start Backend
cd backend
npm run dev

# Start Frontend (in a separate terminal)
cd ../frontend
npm run dev
```

---

## 📂 Project Structure

```text
algoprep/
├── backend/            # Express API Server (Node/TS)
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── libs/        # Judge0 and DB wrappers
│   │   ├── routes/      # API endpoints
│   │   └── middleware/  # Auth and validation logic
│   └── prisma/         # Prisma Schema & Migrations
├── frontend/           # React 19 Application
│   ├── src/
│   │   ├── components/  # Atomic UI units
│   │   ├── page/        # Routed views
│   │   └── store/       # Zustand state slices
│   └── public/          # Static assets
└── docker-compose.yml  # Infrastructure orchestration
```

---

## 📄 License

This project is licensed under the MIT License.

---
**[ AlgoPrep ]** — Engineered for discipline.
