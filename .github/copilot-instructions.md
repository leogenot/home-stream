# Copilot Instructions for AI Coding Agents

## Project Overview

This is a Nuxt 3 (Vue 3) web application for streaming and managing music. The codebase is organized for modularity and clarity, with a clear separation between frontend (UI, composables, pages) and backend (API endpoints).

## Architecture & Key Directories

- **app/**: Main frontend code. Contains:
  - `components/`: Vue components (UI, forms, common elements)
  - `composables/`: Reusable logic (playlist, music, user, upload, Supabase auth)
  - `layouts/`: App-wide layout templates
  - `middleware/`: Route guards (auth, guest)
  - `pages/`: Route-based views (index, profile, upload, auth, playlists)
  - `assets/css/`: Tailwind CSS and custom styles
  - `utils/`: Shared utility functions
- **server/api/**: API endpoints for file upload, metadata, deletion, and cover image serving
- **public/uploads/music/**: Static music files for streaming

## Developer Workflows

- **Install dependencies**: `pnpm install` (preferred)
- **Start dev server**: `pnpm dev` (http://localhost:3000)
- **Build for production**: `pnpm build`
- **Preview production**: `pnpm preview`

## Patterns & Conventions

- **Vue Components**: Use script setup and defineProps/defineEmits. Common UI elements are in `components/Common/`.
- **Composables**: Encapsulate logic for music, playlist, queue, user, upload, and error handling. Example: `useMusic.ts` for music-related state/actions.
- **Auth**: Supabase-based authentication via `useSupabaseAuth.ts` and route middleware (`auth.ts`, `guest.ts`).
- **API**: Server endpoints in `server/api/` follow RESTful patterns. Use async/await and return JSON responses.
- **Styling**: Tailwind CSS is used. Custom styles in `assets/css/`.
- **File Uploads**: Handled via `server/api/upload.post.ts` and `UploadWrapper.vue`.
- **Error/Success Alerts**: Use `ErrorAlert.vue` and `SuccessAlert.vue` for user feedback.

## Integration Points

- **Supabase**: Used for authentication and possibly database (see `useSupabaseAuth.ts`).
- **Music Metadata**: TODOs indicate plans to fetch/store song metadata in DB on upload.

## Examples

- To add a new page, create a `.vue` file in `pages/`.
- To add a new API route, create a file in `server/api/` (e.g., `myroute.get.ts`).
- To add a new composable, place a `.ts` file in `composables/` and export functions.

## Additional Notes

- Follow Nuxt 3 conventions for file-based routing and composables.
- Use async/await for all server-side logic.
- Prefer `pnpm` for all package management commands.
- See `README.md` for basic setup and workflow commands.

---

If any section is unclear or missing, please provide feedback so this guide can be improved for future AI agents.
