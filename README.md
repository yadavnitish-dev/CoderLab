# AlgoPrep

AlgoPrep is a full-stack competitive programming platform where users solve coding problems, run code against test cases, and track submissions. This repo is configured to use the hosted JDoodle Compiler API instead of a self-hosted Judge0 deployment.

## Security Status

🛡️ **Security First**: This codebase implements enterprise-grade security practices including:

- **Zero Critical Vulnerabilities** (Backend: 0 vulnerabilities, Frontend: 2 moderate in dev dependency)
- **Security Headers** (Helmet middleware with HSTS, CSP, X-Frame-Options)
- **Rate Limiting** (Multiple tiers for different endpoints)
- **Input Validation** (Zod schemas with payload limits)
- **Secure Authentication** (JWT in HTTP-only cookies, bcrypt password hashing)
- **Automated Security Scanning** (npm audit in CI/CD pipeline)

## Features

- 🔐 **Secure Authentication** with JWT (HTTP-only cookies), **OAuth 2.0** (Google/GitHub), and **Email Verification**.
- 🛠️ **Account Resilience**: Self-service **Password Recovery** and **Secure Account Deletion**.
- 📚 **Roadmap Mastery** with curated categories and progress tracking.
- ⚡ **Code Execution** for Python, Java, JavaScript, TypeScript, and C++ (via JDoodle API).
- 📊 **Submission History** with per-testcase results.
- 📁 **Playlists** for organizing problems.
- 🎨 **Engineer's Lab UI**: Monochromatic, high-density aesthetic with **Semantic Clarity** overhaul.
- 🛡️ **Security Hardened**: Rate limiting, input validation, security headers, and **Strict Verification Enforcement**.

## Security Features

- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Password Security**: bcrypt hashing with salt rounds
- **Rate Limiting**: Different limits for auth (20/15min), general (100/15min), code execution (10/min)
- **Input Validation**: Zod schemas with size limits (100KB source code, 200KB execution payload)
- **Security Headers**: Helmet middleware (HSTS, CSP, X-Frame-Options, etc.)
- **CORS Protection**: Validated origins only
- **Logging Security**: Sensitive data sanitized from logs
- **CI/CD Security**: Automated vulnerability scanning

## Stack

### Frontend

- **React 19** + **Vite 7**
- **TailwindCSS 4** + **DaisyUI 5**
- **Zustand 5** (State Management)
- **React Router 7**
- **Monaco Editor**

### Backend

- **Node.js** + **Express**
- **PostgreSQL**
- **Prisma 6** (ORM)
- **JDoodle Compiler API**

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

# OAuth & Email Configuration
See the dedicated guides for generating secure credentials:
- **[OAuth Setup Guide](file:///Users/nitish/.gemini/antigravity/brain/dec500f0-228c-4717-81c3-9a8d8f493c18/OAUTH_SETUP_GUIDE.md)**
- **[Resend Setup Guide](file:///Users/nitish/.gemini/antigravity/brain/dec500f0-228c-4717-81c3-9a8d8f493c18/RESEND_SETUP_GUIDE.md)**

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

## Security Notes

⚠️ **Important**: Never commit `.env` files to version control. The `.env` file is gitignored by default.

### Environment Variables Security

- `JWT_SECRET`: Use a strong, random 256-bit key
- `JDOODLE_CLIENT_ID/SECRET`: Keep server-side only, never expose to frontend
- `DATABASE_URL`: Use SSL connections (`sslmode=require`)

### Current Security Status

- ✅ **Backend**: 0 vulnerabilities (all fixed)
- ⚠️ **Frontend**: 2 moderate vulnerabilities (in Monaco editor dev dependency - acceptable)
- ✅ **CI/CD**: Automated security scanning enabled
- ✅ **Secrets**: Not committed to repository

### Security Best Practices

- Rotate secrets regularly
- Use HTTPS in production
- Keep dependencies updated
- Monitor for new vulnerabilities
- Implement proper logging (not included in this MVP)

## Project Assessment

| Category | Rating | Status |
|----------|---------|--------|
| **Architecture** | 8.0/10 | Standard Service Layer / Missing centralized error handling |
| **Code Quality** | 7.5/10 | Suppressed warnings / Some "any" usage / Long components |
| **UI Aesthetic** | 9.0/10 | Strong niche aesthetic / Accessibility concerns |
| **Functionality** | 8.0/10 | Core DSA flow / Missing social & persistence features |
| **Performance** | 7.5/10 | SPA-only / No DB indexing strategy / Large client bundles |
| **Maintainability** | 7.5/10 | Modular but dependent on 3rd party execution engine |
| **Security** | 8.0/10 | JWT Cookies / Rate Limiting / Missing MFA |
| **Testing** | 4.0/10 | **Critical Weakness**: Zero automated test coverage |
| **Documentation** | 6.0/10 | Basic setup / Missing API docs (Swagger) |
| **User Experience** | 8.0/10 | Clean workflow / Lacks onboarding & mobile optimization |
| **Scalability** | 7.0/10 | Stateless API / Missing Caching (Redis) & Read Replicas |
| **Innovation** | 7.5/10 | Strong aesthetic polish / Standard functional logic |

**Overall Score: 7.3/10**

> [!TIP]
> AlgoPrep achieves a world-class workspace experience by blending brutalist structural elements with high-density metadata visualization.
