# GEMINI Mandates - AlgoPrep

This file contains foundational mandates and project-specific instructions for Gemini CLI.

## Core Stack
- **Frontend:** React 19 (Vite), TailwindCSS 4, DaisyUI 5, Zustand, React Router 7, Monaco Editor.
- **Backend:** Node.js (Express), Prisma 6 (PostgreSQL), JDoodle API.
- **Language:** TypeScript (Strict mode).

## Architectural Guidelines

### Design Philosophy (CRITICAL)
- **Aesthetic**: Premium, monochromatic workspace ("Engineer's Lab") aesthetic. Rely on zinc grays (`zinc-900`, `zinc-800`), rich black (`#0a0a0a`), and emerald accents (`emerald-500`) for success/progress.
- **Visual Unification**: Every primary page (Dashboard, Explore, Auth, Settings) MUST use the subtle blueprint grid background: `radial-gradient(#fff 1px, transparent 1px)` at 40px size with ~3% opacity.
- **Structure**: 
  - **Intuitive Mastery**: Use a linear roadmap for core curriculum (NeetCode 150).
  - **Semantic Clarity**: Use clear, accessible labels (Novice, Expert, Completion) instead of technical jargon (Protocol, Synchronization).
  - **High-Density Layout**: Maximize screen real estate with IDE-like layouts, monospaced metadata, and brutalist-adjacent structural elements (solid borders, crisp paddings).
- **UI Elements**: **AVOID glassmorphism**, heavily saturated gradients, or overly bubbly designs. Use `lucide-react` for iconography and `BrutalistButton/Select` components.

- **Frontend:**
  - Use Zustand for state management (`frontend/src/store`).
  - Use React Hook Form with Zod for form validation (`frontend/src/components/CreateProblemForm.tsx`).
  - Follow the `frontend/src/page` and `frontend/src/components` structure.
  - TailwindCSS 4 is used; avoid legacy Tailwind configurations if possible.
- **Backend:**
  - Prisma for database interactions. Generated client is in `backend/src/generated/prisma`.
  - Controllers in `backend/src/controllers`, Routes in `backend/src/routes`.
  - Use `backend/src/libs/db.ts` for Prisma client instance.
  - Authentication via JWT and cookies.

## Problem & Judging Standards (CRITICAL)
Refer to `createProblemRule.md` for detailed rules.
- **Batched Execution:** All test cases for a problem are sent in ONE JDoodle execution.
- **Stdin Contract:**
  1. First line: Total test case count `T`.
  2. For each test case: One line with line count `L`, followed by `L` lines of raw input.
- **Output Contract:** Each case output must be wrapped in:
  ```text
  __ALGOPREP_CASE_START__
  <case output>
  __ALGOPREP_CASE_END__
  ```
- **Solution Templates:** Must include the batched wrapper to parse stdin and wrap outputs.

## Development Workflow
- **Database Changes:** Always run `npx prisma migrate dev` in the `backend` folder after modifying `schema.prisma`.
- **Environment:** Ensure `.env` files in both `frontend` and `backend` are correctly configured based on `.env.example`.
- **Validation:** Always verify that new problems pass the "Validation Checklist" in `createProblemRule.md`.

## Security
- Never log or expose `JDOODLE_CLIENT_SECRET`.
- Ensure all sensitive routes are protected by `authMiddleware`.
