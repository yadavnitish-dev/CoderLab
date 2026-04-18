# AlgoPrep

AlgoPrep is a full-stack competitive programming platform where users solve coding problems, run code against test cases, and track submissions. This repo is configured to use the hosted JDoodle Compiler API instead of a self-hosted Judge0 deployment.

## Features

- Authentication with JWT
- Problem library with examples, constraints, and hidden testcases
- Code execution for Python, Java, JavaScript, TypeScript, and C++
- Submission history with per-testcase results
- Playlists for organizing problems
- React frontend with Monaco editor

## Stack

### Frontend

- React + Vite
- TailwindCSS + DaisyUI
- Zustand
- Monaco Editor

### Backend

- Node.js + Express
- PostgreSQL
- Prisma
- JDoodle Compiler API

## Execution Flow

1. The frontend sends source code, language, and all testcase inputs to the backend.
2. The backend batches all testcases into a single payload and calls JDoodle’s `POST https://api.jdoodle.com/v1/execute` endpoint exactly once.
3. The backend parses the batched output from JDoodle, compares each result to the expected output, and stores the submission plus testcase-level results.

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL
- A JDoodle account with API credentials

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Set these values in `backend/.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/algoprep
JWT_SECRET=replace_this
JDOODLE_CLIENT_ID=your_client_id
JDOODLE_CLIENT_SECRET=your_client_secret
```

Then run:

```bash
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## JDoodle Notes

- API keys come from the JDoodle API dashboard after subscribing to a plan.
- The backend keeps `JDOODLE_CLIENT_SECRET` server-side only. Do not expose it in the frontend.
- Supported language/version mappings in this repo are:
  - Python: `python3` / version index `5`
  - Java: `java` / version index `5`
  - JavaScript: `nodejs` / version index `6`
  - TypeScript: `typescript` / version index `0`
  - C++: `cpp17` / version index `0`

## Official JDoodle Docs

- https://www.jdoodle.com/docs/compiler-apis/jdoodle-api-quickstart/getting-started/
- https://www.jdoodle.com/docs/compiler-apis/client-id-secret-key/
- https://www.jdoodle.com/docs/compiler-apis/supported-languages-versions/
