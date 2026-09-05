# Notiva Frontend

The Next.js frontend for Notiva, a focused note-taking and AI-assisted productivity application. This repository currently contains the Phase 1 project foundation only.

## Tech stack

- Next.js (App Router) and TypeScript
- Tailwind CSS and shadcn/ui
- TanStack Query
- React Hook Form, Zod, and `@hookform/resolvers`
- Axios
- Tiptap
- Lucide React
- next-themes

## Requirements

- Node.js 20.9 or later
- npm
- Notiva Spring Boot backend running at [http://localhost:8080](http://localhost:8080)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and confirm the API base URL.

3. Start the frontend:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL of the Notiva backend. Use `http://localhost:8080` in local development. |

`.env.local` is intentionally ignored by Git. Do not put secrets, including AI provider keys, in browser-visible environment variables.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Create a production build. |
| `npm run start` | Run the production server after building. |

## Backend requirement

Run the Notiva Spring Boot API at [http://localhost:8080](http://localhost:8080) before implementing API-backed phases. The frontend reads this endpoint from `NEXT_PUBLIC_API_BASE_URL`.
