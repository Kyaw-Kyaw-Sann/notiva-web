# Notiva Frontend

Notiva is a responsive note-taking and AI-assisted productivity workspace built with Next.js. It connects to a separate Spring Boot API and keeps AI provider access, persistence, authorization, and private credentials on the backend.

## Features

- Public product landing page
- Email/password and Google OAuth authentication
- Rotating refresh-token session handling
- Account recovery and email verification
- Responsive authenticated workspace and navigation
- Notes dashboard with server-side search, filtering, sorting, and pagination
- Categories, pinning, favorites, recycle bin, and permanent deletion
- Tiptap rich-text editor with autosave, tables, links, checklists, and images
- Version history with preview and restore
- AI writing actions with result preview and explicit acceptance
- Note-specific and all-notes conversations
- Semantic note search and source references
- Profile, appearance, editor, notes-view, security, and AI usage settings
- Privacy-conscious admin statistics and user metadata

## Tech stack

- Next.js App Router, React, and strict TypeScript
- Tailwind CSS and shadcn/Radix UI primitives
- TanStack Query
- React Hook Form, Zod, and `@hookform/resolvers`
- Axios
- Tiptap
- Lucide React
- `next-themes`

## Architecture

```text
Browser
  -> Notiva Next.js frontend
  -> Notiva Spring Boot REST API
  -> PostgreSQL / image storage / email / AI provider
```

The frontend never calls the AI provider directly and must not contain backend credentials or AI API keys.

## Requirements

- Node.js 20.9 or later
- npm
- Notiva Spring Boot backend

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Start the application:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Absolute URL of the Notiva Spring Boot API. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Absolute canonical URL of this frontend, used by metadata, sitemap, and robots output. |

Both variables are intentionally public browser configuration. Never put database credentials, JWT secrets, email credentials, OAuth client secrets, or AI provider keys in `NEXT_PUBLIC_*` variables.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run the TypeScript compiler without emitting files. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server after building. |
| `npm run check` | Run lint, type-check, and production build checks. |

## Production deployment

Deploy the Spring Boot backend first and obtain its public HTTPS URL. Configure the frontend host with production values before building:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Then verify:

```bash
npm ci
npm run check
npm run start
```

The backend must allow the exact frontend production origin through CORS. Google OAuth, email verification, password recovery, avatar/image delivery, and frontend redirects must also use the production frontend URL.

The project can run on a Next.js-compatible platform or any Node.js host using the included `build` and `start` scripts.

## Production security notes

- Authentication tokens must never be logged or included in analytics.
- Refresh tokens are used only for refresh/logout and never as Bearer tokens.
- Groq and other backend secrets must remain on the Spring Boot server.
- Admin UI displays documented account metadata only, never private note or conversation content.
- Uploaded image domains and the production API origin should be explicitly allowlisted before introducing a strict Content Security Policy.

## Screenshots

Real product screenshots used by the landing page are stored in `public/DS1.png` through `public/DS5.png`. Use demo-only names, email addresses, and note content in any screenshot committed to the public repository.

## Backend requirement

Most authenticated functionality requires the Notiva Spring Boot API. For local development it should run at [http://localhost:8080](http://localhost:8080). For production, configure its HTTPS URL through `NEXT_PUBLIC_API_BASE_URL`.
