# AGENTS.md — Notiva Frontend

This file defines the working rules for Codex when building and maintaining the **Notiva frontend Next.js project**.

Codex should treat this file as the primary repository-level guidance for implementation decisions. The goal is to produce a clean, understandable, professional frontend suitable for a junior full-stack developer portfolio while staying aligned with the existing Notiva Spring Boot backend and the provided Notiva product/UI references.

---

## Interaction Rules

- The user may ask questions in English, but always respond in Myanmar language.

- Never add, update, remove, rename, move, fix, or modify any code, file, folder, configuration, dependency, or project structure without explicit permission.

- Do not make any project changes unless the user explicitly says the exact phrase:

  "Build Now"

- Before the phrase "Build Now" is given, only:
  - discuss
  - explain
  - review
  - plan
  - suggest
  - provide commands or code snippets without applying them

- When the user says "Build Now", you may make only the changes that were discussed or explicitly requested.

- Do not interpret similar phrases such as "go ahead", "continue", "start", "do it", or "proceed" as permission to modify the project.

- If "Build Now" has not been explicitly provided, do not modify the project.


## 1. Project Identity

**Project:** Notiva  
**Frontend:** Next.js + TypeScript  
**Backend:** Spring Boot REST API  
**Database:** PostgreSQL  
**AI provider:** accessed only through the backend; never call Groq directly from the frontend  
**Primary frontend goal:** a polished, responsive note-taking and AI-assisted productivity app

Notiva is not intended to be a full Notion clone. Prefer a focused, reliable notes product with strong UX, clean architecture, and realistic production-style behavior.

---

## 2. Source-of-Truth Priority

When requirements conflict or are unclear, use this priority:

1. The current backend API documentation / actual backend contract
2. Explicit user requirements in the current task
3. This `AGENTS.md`
4. Provided Notiva product screenshots and UI/UX reference screenshots
5. Existing frontend code and established project conventions
6. Reasonable implementation judgment

Important:

- Do not invent API endpoints, fields, enums, or backend capabilities.
- Do not silently build frontend-only fake features that imply backend support.
- If a desired UI feature is not supported by the backend, either keep it local-only where appropriate or clearly report the missing backend requirement.
- When the API contract changes, update frontend types and integration code deliberately.

---

## 3. Approved Development Roadmap

Use the word **Phase**, not “Version”.

The agreed frontend development phases are:

1. **Phase 1 — Project Foundation**
2. **Phase 2 — Design System**
3. **Phase 3 — API Client Architecture**
4. **Phase 4 — Core Authentication**
5. **Phase 5 — Refresh Token & Session Reliability**
6. **Phase 6 — Account Recovery & Email Verification**
7. **Phase 7 — Main App Shell**
8. **Phase 8 — Responsive Navigation**
9. **Phase 9 — Notes Dashboard**
10. **Phase 10 — Search, Filter, Sort & Pagination**
11. **Phase 11 — Categories**
12. **Phase 12 — Note CRUD**
13. **Phase 13 — Rich Text Editor**
14. **Phase 14 — Autosave & Editor UX**
15. **Phase 15 — Recycle Bin & Version History**
16. **Phase 16 — Note Images**
17. **Phase 17 — AI Writing Assistant**
18. **Phase 18 — AI Conversations & Semantic Search**
19. **Phase 19 — Profile, Settings & Admin**
20. **Phase 20 — Production Readiness, Testing & Deployment**

### Phase discipline

When the user asks to work on one phase:

- focus on that phase;
- do not implement major future-phase features unless technically required;
- do not “helpfully” expand scope;
- leave clean extension points for later phases;
- report any dependency that blocks the current phase;
- preserve already completed behavior.

For the current project start, assume **Phase 1 — Project Foundation** unless the user explicitly advances the project.

---

## 4. Intended Frontend Stack

Preferred stack:

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- `@hookform/resolvers`
- Tiptap
- Lucide React
- `next-themes`

Axios may be used for the centralized API client if the project already uses it. Do not introduce multiple HTTP client styles without a reason.

### State-management policy

Do not add Redux or Zustand by default.

Use:

- **TanStack Query** for server state;
- **React Hook Form** for form state;
- **URL search params** for shareable/filterable page state;
- **React local state** for component/UI state;
- **next-themes** for theme state.

Add a global client-state library only when there is a concrete need that cannot be handled cleanly with the above.

---

## 5. General Engineering Principles

Prefer:

- simple over clever;
- explicit over magical;
- typed over loosely shaped data;
- feature-based organization over giant global folders;
- reusable components when reuse is real;
- small focused files over large multipurpose files;
- predictable data flow;
- accessible UI;
- responsive behavior;
- graceful failure states;
- backend-contract accuracy.

Avoid:

- premature abstractions;
- unnecessary wrappers;
- speculative infrastructure;
- duplicate types;
- giant “utils” files;
- excessive context providers;
- global mutable state;
- fake data left in production paths;
- placeholder features that look functional but are not;
- TODO-heavy implementations presented as complete.

---

## 6. Repository and Folder Structure

Prefer a structure like:

```text
src/
├── app/
│   ├── (auth)/
│   ├── (app)/
│   ├── admin/
│   ├── oauth2/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   └── layout/
│
├── features/
│   ├── auth/
│   ├── notes/
│   ├── categories/
│   ├── ai/
│   ├── profile/
│   └── admin/
│
├── hooks/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── query/
│   ├── constants/
│   └── utils.ts
│
├── providers/
│
└── types/
```

A feature may grow into:

```text
features/notes/
├── api/
├── components/
├── hooks/
├── schemas/
├── types/
└── utils/
```

Do not create empty folders just to match the planned tree. Create them when actual files are needed.

---

## 7. Naming Conventions

Prefer kebab-case filenames:

```text
note-card.tsx
app-sidebar.tsx
query-provider.tsx
use-notes.ts
note.schema.ts
note.types.ts
```

React components:

```text
NoteCard
AppSidebar
QueryProvider
```

Hooks:

```text
useNotes
useCurrentUser
useCreateNote
```

API functions:

```text
getNotes
getNote
createNote
updateNote
```

Types:

```text
Note
User
Category
ApiResponse<T>
ApiError
```

Use the `@/*` import alias where configured. Avoid deeply nested relative imports such as:

```text
../../../../components/...
```

---

## 8. TypeScript Rules

Keep TypeScript strict and useful.

- Avoid `any`.
- Prefer `unknown` when the shape truly is unknown.
- Validate untrusted form input with Zod.
- Do not duplicate backend DTO shapes in multiple places.
- Reuse shared frontend contract types.
- Narrow nullable and optional values intentionally.
- Avoid unsafe non-null assertions unless the invariant is obvious and documented.
- Keep public function boundaries easy to understand.

Do not decode JWTs to derive user identity when the backend already provides the authenticated user.

---

## 9. Next.js Rules

Use App Router conventions.

### Server vs Client Components

Default to Server Components.

Add `"use client"` only when required for:

- React state/effects;
- forms;
- event handlers;
- TanStack Query hooks;
- theme interaction;
- dialogs/dropdowns;
- responsive interactive navigation;
- Tiptap;
- AI chat interactions.

Do not mark large page trees as client components just because one child needs interaction. Isolate client boundaries.

### Routing

Use route groups where they improve organization:

```text
app/(auth)/
app/(app)/
```

Do not expose implementation details in route URLs unnecessarily.

---

## 10. Environment Configuration

Development backend base URL:

```text
http://localhost:8080
```

Expected frontend environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Keep:

```text
.env.local
```

out of Git.

Commit:

```text
.env.example
```

Never place real secrets in browser-visible environment variables.

### Critical security rule

The frontend must **never contain or call Groq with a Groq API key**.

Correct flow:

```text
Browser
  ↓
Next.js frontend
  ↓
Notiva Spring Boot API
  ↓
Groq
```

---

## 11. Backend API Contract Rules

The current Notiva backend uses a consistent success envelope for nearly all API endpoints:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "..."
}
```

Error responses follow a structure similar to:

```json
{
  "success": false,
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/...",
  "validationErrors": {
    "field": "message"
  },
  "timestamp": "..."
}
```

Frontend rules:

- show safe backend `message` values where appropriate;
- map `validationErrors` to matching form fields;
- never display raw Axios/fetch errors;
- never display stack traces;
- never display secrets;
- never expose AI provider diagnostic text to users.

Common statuses to handle intentionally:

- `400` invalid request / validation
- `401` missing or invalid authentication
- `403` authenticated but unauthorized
- `404` unavailable/not found resource
- `409` conflict
- `429` AI limit/rate issue
- `502` invalid AI upstream response
- `503` AI provider unavailable
- `504` AI timeout
- `500` unexpected server error

---

## 12. Authentication Contract

### Access token

- short-lived JWT;
- sent as:

```http
Authorization: Bearer <accessToken>
```

- use the backend `expiresIn` value for access-token expiry handling;
- do not depend on decoding the JWT for user identity.

### Refresh token

The refresh token is:

- opaque;
- rotating;
- used only for refresh/logout;
- never a Bearer token.

Successful refresh returns both:

- a new access token;
- a new refresh token.

The old refresh token is revoked after successful rotation.

### Refresh behavior

On an authenticated request receiving `401`:

1. perform at most one refresh attempt;
2. avoid concurrent duplicate refresh requests;
3. store both newly returned tokens;
4. retry the original request once;
5. if refresh fails, clear auth state and return to sign-in.

Never build an infinite retry loop.

### Logout

Clear frontend auth state even if the logout request fails because the refresh token is already invalid.

---

## 13. Google OAuth Contract

Google sign-in starts with browser navigation to:

```text
/oauth2/authorization/google
```

It is not an AJAX login request.

After backend callback, the frontend callback route receives an access token in the URL fragment:

```text
/oauth2/callback#access_token=...
```

Frontend callback rules:

1. read the fragment client-side;
2. remove the token from browser history immediately;
3. call `GET /api/auth/me`;
4. establish the user session;
5. enter the application.

Current backend limitation:

- Google OAuth returns an access token only;
- it does not currently return a refresh token.

Do not pretend OAuth sessions have the same refresh behavior unless the backend contract changes.

---

## 14. Shared Backend Enums

Keep frontend values aligned with the backend.

### Role

```text
USER
ADMIN
```

### Plan

```text
NORMAL
PREMIUM
```

### Note background color

```text
DEFAULT
YELLOW
GREEN
BLUE
PINK
PURPLE
GRAY
```

### Note sort

```text
UPDATED_DESC
UPDATED_ASC
CREATED_DESC
CREATED_ASC
TITLE_ASC
TITLE_DESC
```

### AI summary length

```text
SHORT
MEDIUM
DETAILED
```

### AI writing action

```text
IMPROVE
FIX_GRAMMAR
SHORTEN
EXPAND
PROFESSIONAL
CONTINUE
CUSTOM
```

Do not silently rename values sent to the backend.

---

## 15. Notes Contract

Typical note data includes:

```text
id
title
contentJson
plainText
backgroundColor
category
pinned
favorite
deletedAt
createdAt
updatedAt
```

### Important editor ownership rule

The backend stores `contentJson` as a string.

The frontend owns the rich-text editor JSON schema.

Therefore:

- keep a stable Tiptap schema;
- serialize editor JSON deliberately;
- preserve valid editor data;
- derive `plainText` from editor content for backend search;
- avoid ad-hoc migrations without considering old saved notes.

Typical note write payload:

```json
{
  "title": "Project ideas",
  "contentJson": "{\"type\":\"doc\",\"content\":[]}",
  "plainText": "Project ideas and next steps",
  "backgroundColor": "YELLOW",
  "categoryId": 3
}
```

Do not send `userId` or `ownerId`.

Ownership is enforced by the backend from the authenticated user.

---

## 16. Notes Search and Filtering

The backend supports note search with optional parameters including:

```text
query
categoryId
uncategorized
backgroundColor
pinned
favorite
sort
page
size
```

Use URL search params for dashboard state when practical.

Example frontend URL:

```text
/notes?query=project&category=3&sort=UPDATED_DESC&page=0
```

Benefits:

- refresh-safe;
- browser back/forward works;
- easier debugging;
- shareable state;
- predictable pagination.

Backend page numbering starts at `0`.

Do not fetch all notes and reimplement server pagination/filtering on the client when the server already supports it.

---

## 17. Categories

Category functionality includes:

- create;
- list;
- get;
- rename/update;
- delete.

Deleting a category does **not** delete its notes. Those notes become uncategorized.

UI confirmation should reflect that behavior and must not incorrectly warn that notes will be deleted.

---

## 18. Trash and Permanent Delete

Note deletion is soft delete first.

Support the conceptual lifecycle:

```text
active note
  ↓ delete
recycle bin
  ├── restore
  └── permanently delete
```

Also support emptying the current user's recycle bin when the relevant phase is implemented.

Permanent deletion is irreversible.

Use clear destructive confirmation UI.

Do not optimistically pretend an irreversible deletion succeeded before the server confirms it.

---

## 19. Version History

The backend supports:

- list note versions;
- read one version;
- restore a version.

When implemented:

- make timestamps clear;
- allow preview before restore;
- confirm restoration where appropriate;
- refresh the active note/cache after restore.

Version history belongs to note history, not app release/version terminology.

---

## 20. Image Uploads

Note images use multipart upload.

Rules:

- use `FormData`;
- do not manually set multipart boundaries;
- do not send JSON `Content-Type` for file upload;
- keep loading and error states;
- persist returned image metadata needed by the editor.

The backend does not automatically attach an uploaded image to a note.

The editor must persist the returned URL/public ID in its own `contentJson` model if needed.

---

## 21. AI Product Rules

AI is an enhancement to notes, not a destructive automation layer.

Supported product concepts include:

- general generation;
- generate note title;
- summarize;
- improve writing;
- fix grammar;
- shorten;
- expand;
- professional tone;
- continue writing;
- custom instruction;
- suggest category;
- note conversations;
- all-notes conversations;
- AI usage;
- semantic search.

### AI writing safety/UX

Never automatically overwrite note text merely because AI generation succeeded.

Prefer a result preview with actions such as:

```text
Replace selection
Insert below
Cancel
```

The user remains in control of editor changes.

### AI failures

Treat these as non-destructive, retry-friendly failures:

```text
429
502
503
504
```

Do not discard editor state.

Do not show Groq/provider internals.

Use calm, useful messages such as:

```text
AI is temporarily unavailable. Please try again.
```

---

## 22. AI Conversations

Support both concepts when their phase is reached:

- conversation scoped to a note;
- conversation across all notes.

Conversation capabilities include:

- create;
- list;
- open;
- send message;
- load messages;
- rename;
- delete.

A typical conversation has:

```text
id
title
type
note
createdAt
updatedAt
```

A message has:

```text
id
role
content
createdAt
```

Do not send client-owned IDs as authorization decisions. Backend ownership controls access.

---

## 23. Semantic Search

The user-facing feature should be understandable.

Prefer wording such as:

```text
Ask your notes
```

rather than developer jargon like:

```text
Embedding semantic-search endpoint
```

Do not expose operational embedding endpoints such as:

- embedding test;
- note chunk count;
- rebuild missing embeddings;

in normal user navigation unless product requirements explicitly change.

---

## 24. Profile and Account

The backend supports user profile functionality including:

- get profile;
- update display name;
- change password;
- avatar upload;
- avatar removal;
- upgrade;
- downgrade;
- account deletion.

Avatar upload is multipart.

Account deletion is destructive and must use a strong confirmation UX.

---

## 25. Settings

The provided UI references show a settings experience that is clean, compact, and productivity-oriented.

Supported/appropriate frontend settings include:

- Light / Dark / System appearance;
- Grid / List note view;
- editor width preferences;
- profile/account settings;
- AI usage display.

If there is no backend endpoint for a purely frontend preference, local storage is acceptable.

Do not create fake backend synchronization.

Do not imply that unsupported settings are synced across devices.

---

## 26. Admin

The admin frontend must remain minimal.

Backend-supported admin capabilities include:

### Dashboard

- total users;
- total notes;
- total AI requests.

### Users

- search;
- pagination;
- user metadata.

Admin user metadata intentionally excludes private note content.

### Privacy rule

Do **not** build an admin UI for reading users' private note bodies.

The provided backend contract deliberately avoids returning that content.

Authorization behavior:

```text
unauthenticated → 401
USER           → 403
ADMIN          → allowed
```

Client-side route guards improve UX but are not security boundaries.

---

## 27. UI/UX Design Direction

The provided Notiva UI/UX screenshots are the visual reference.

The desired design language is:

- clean;
- minimal;
- modern productivity UI;
- desktop-first while fully responsive;
- soft purple/indigo accent;
- light surfaces;
- low-contrast borders;
- restrained shadows;
- generous whitespace;
- rounded cards and controls;
- visually calm;
- content-focused.

Do not turn the app into a highly decorative dashboard.

Avoid:

- excessive gradients;
- strong glassmorphism;
- neon colors;
- oversized marketing typography inside the app;
- heavy shadows;
- noisy borders;
- unnecessary animation.

---

## 28. Main App Layout Reference

Desktop conceptual structure:

```text
AppShell
├── Sidebar
│   ├── Notiva logo
│   ├── New Note
│   ├── All Notes
│   ├── Pinned
│   ├── Favorites
│   ├── AI Conversations
│   ├── Recycle Bin
│   ├── Categories
│   ├── User/Profile
│   ├── Settings
│   └── Theme
│
└── MainContent
```

Notes page should support a clean header with search/filter/sort/view actions and a spacious cards/list area.

Do not cram every action into every card.

Use menus for secondary actions.

---

## 29. Note Editor Reference

The provided editor UI suggests a focused workspace:

```text
NoteEditor
├── TopBar
│   ├── Back
│   ├── Category
│   ├── Favorite
│   ├── Save status
│   ├── AI
│   └── More menu
│
├── Title
├── RichTextToolbar
├── Editor
└── Footer / metadata
```

On wide desktop layouts, AI may appear as a right-side panel.

On smaller screens, AI should become a drawer/sheet or dedicated full-screen interaction rather than crushing the editor width.

---

## 30. Responsive Behavior

Target three broad behaviors:

### Desktop

- persistent sidebar;
- wide note workspace;
- optional right AI panel.

### Tablet

- compact/collapsible navigation;
- preserve editor readability;
- AI may use a drawer.

### Mobile

- drawer navigation;
- one-column note list/cards;
- full-width editor;
- AI sheet/full-screen view;
- touch-friendly actions;
- avoid tiny desktop toolbars.

Responsive quality is not a final afterthought. Each relevant feature should be implemented with mobile behavior considered at the same time.

---

## 31. Accessibility

Build accessible components from the start.

Requirements:

- semantic HTML;
- keyboard-accessible controls;
- visible focus states;
- proper labels;
- meaningful button names;
- accessible dialogs;
- sensible heading hierarchy;
- avoid color-only meaning;
- sufficient contrast;
- destructive actions clearly named.

Prefer shadcn/Radix primitives over custom inaccessible interaction code.

---

## 32. Forms and Validation

Use:

- React Hook Form;
- Zod;
- backend validation feedback.

Rules:

- perform useful client validation;
- still respect backend validation as authoritative;
- map backend `validationErrors` to fields;
- show a useful form-level message when necessary;
- do not duplicate complicated backend business rules unnecessarily in the browser.

Never expose raw server exception strings.

---

## 33. TanStack Query Conventions

Suggested query-key patterns:

```text
['auth', 'me']

['notes']
['notes', 'search', filters]
['notes', noteId]
['notes', 'pinned']
['notes', 'favorites']
['notes', 'trash']
['notes', noteId, 'versions']

['categories']

['ai', 'usage']
['ai', 'conversations']
['ai', 'conversation', conversationId]
['ai', 'conversation', conversationId, 'messages']

['admin', 'dashboard']
['admin', 'users', filters]
```

Do not scatter literal query keys randomly throughout the project if a small query-key helper improves consistency.

After mutations:

- update cache directly when safe;
- invalidate/refetch relevant queries when safer;
- avoid refetching unrelated application data.

---

## 34. Optimistic Updates

Good candidates:

- pin/unpin;
- favorite/unfavorite;
- simple reversible UI preferences.

Use rollback on failure.

Avoid optimistic behavior for:

- permanent note deletion;
- account deletion;
- AI-generated text replacement;
- operations where a failed request would be confusing or destructive.

---

## 35. Autosave Principles

When the autosave phase is reached:

- debounce editor updates;
- distinguish dirty/saving/saved/error states;
- do not fire a request for every keystroke;
- prevent stale save responses from overwriting newer local content;
- preserve unsaved local editor state on temporary API failure;
- show retryable save failure state;
- consider navigation while a save is in flight.

Target UI concepts:

```text
Saving...
Saved
Save failed
```

Do not claim “Saved” before the server confirms it.

---

## 36. Error, Loading, and Empty States

Every major screen should intentionally support:

- loading;
- empty;
- error;
- retry;
- success feedback where useful.

Examples:

```text
No notes yet
No pinned notes
No favorites
No search results
Recycle bin is empty
No conversations yet
No categories yet
```

Prefer skeletons for content-loading surfaces and spinners for compact actions.

---

## 37. Security Rules

Never:

- commit secrets;
- expose Groq keys;
- put sensitive credentials in `NEXT_PUBLIC_*`;
- use refresh tokens as Bearer tokens;
- send owner/user IDs where ownership is inferred from auth;
- trust client role checks as authorization;
- render raw server/provider errors;
- log tokens;
- place tokens in analytics;
- expose OAuth URL fragment tokens longer than necessary.

Treat another user's inaccessible note/conversation as unavailable. Do not leak ownership details.

---

## 38. Dependency Policy

Before adding a package:

1. verify the project does not already have a solution;
2. confirm the package solves a real problem;
3. prefer common, maintained libraries;
4. avoid introducing overlapping packages;
5. avoid adding a heavy dependency for a tiny helper.

Do not change package manager without explicit instruction.

If the repository already uses npm, stay with npm.

---

## 39. Testing Expectations

Testing should focus on valuable behavior, not inflated coverage numbers.

High-value targets include:

- login;
- registration validation;
- refresh flow;
- refresh failure/logout;
- protected routes;
- notes loading;
- create/update note;
- autosave;
- search/filter/pagination;
- pin/favorite;
- trash/restore;
- version restore;
- AI success/error states;
- admin authorization behavior.

Use the project's existing test stack if present.

For end-to-end testing, Playwright is appropriate when introduced intentionally.

Do not add a testing library merely to satisfy this file during Phase 1 unless the user requests it or the phase requires it.

---

## 40. Build and Quality Checks

Before declaring a meaningful task complete, run the relevant checks available in the project.

At minimum, for foundational or cross-cutting changes:

```bash
npm run lint
npm run build
```

Run tests when tests exist and the changed area is covered.

Do not report success if commands fail.

If a failure is unrelated and pre-existing, identify it clearly.

---

## 41. Git and Change Discipline

Codex should:

- keep changes scoped;
- avoid unrelated formatting churn;
- preserve user code unless change is necessary;
- inspect existing conventions before rewriting;
- avoid mass renames without value;
- avoid deleting code just because it appears unused without checking imports/runtime usage;
- do not reset or overwrite unrelated uncommitted work.

Do not create commits unless the user explicitly asks.

When asked for a commit suggestion, prefer concise conventional-style messages, for example:

```text
feat: add notes dashboard
fix: handle rotating refresh tokens
refactor: centralize api error handling
```

---

## 42. Codex Workflow for Every Task

Before editing:

1. read this `AGENTS.md`;
2. inspect relevant files;
3. identify the current phase;
4. understand existing code before proposing replacement;
5. check backend API documentation if integration is involved.

During editing:

1. make the smallest coherent change;
2. preserve types;
3. preserve responsive behavior;
4. handle loading/error states where relevant;
5. do not implement future-phase scope accidentally.

After editing:

1. inspect the diff;
2. run relevant lint/build/tests;
3. fix errors introduced by the change;
4. summarize what changed;
5. list files changed;
6. mention any remaining limitation or backend dependency;
7. state whether checks passed.

---

## 43. How Codex Should Communicate

When reporting a completed coding task, prefer this structure:

```text
Implemented
- ...
- ...

Key files
- ...

Validation
- npm run lint: passed
- npm run build: passed

Notes
- ...
```

Do not produce a long tutorial unless asked.

If a decision has meaningful trade-offs, explain the choice briefly.

If the user asks for learning-oriented explanation, explain the code in clear junior-developer-friendly language.

---

## 44. What Codex Must Not Do

Do not:

- implement all phases at once;
- convert the app into a different architecture without instruction;
- invent backend endpoints;
- create fake admin powers;
- expose private notes to admins;
- call Groq directly from the browser;
- add Redux by default;
- add Zustand by default;
- create unnecessary micro-abstractions;
- create empty architecture folders everywhere;
- put `"use client"` on everything;
- decode JWTs as the primary user source;
- hard-code production API URLs;
- manually set multipart boundaries;
- auto-accept AI edits;
- silently swallow save errors;
- claim tasks are complete without checking build/lint where appropriate.

---

## 45. Phase 1 — Project Foundation Definition of Done

For **Phase 1**, the target is foundation only.

Expected work:

- create/verify Next.js + TypeScript project;
- App Router;
- Tailwind;
- shadcn/ui foundation;
- TanStack Query dependency/provider;
- React Hook Form + Zod dependencies;
- Tiptap core dependency;
- Lucide;
- next-themes;
- clean folder structure;
- environment config;
- root providers;
- basic README;
- `.env.example`;
- `.gitignore` correctness;
- successful dev/build/lint.

Do **not** build yet:

- full design system;
- login UI;
- refresh-token logic;
- notes dashboard;
- editor;
- AI chat;
- admin dashboard.

Phase 1 is complete when the frontend is clean, runnable, typed, and ready for the next phase.

---

## 46. Product Quality Target

The finished Notiva frontend should feel like a coherent product, not a collection of tutorial features.

A successful result should demonstrate:

- thoughtful Next.js structure;
- strong TypeScript usage;
- real Spring Boot integration;
- robust authentication;
- reliable session refresh;
- responsive UI;
- polished note management;
- rich-text editing;
- autosave;
- safe AI integration;
- user-controlled AI writing;
- semantic search;
- version history;
- privacy-conscious admin behavior;
- clear error handling;
- maintainable code.

The project should remain understandable enough that a junior developer can explain the architecture and major implementation decisions during an interview.

---

## 47. Final Principle

When uncertain, prefer the implementation that is:

**simpler, safer, easier to explain, aligned with the backend contract, visually consistent with the supplied Notiva references, and appropriate for the current phase.**
