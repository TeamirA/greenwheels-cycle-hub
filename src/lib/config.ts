// Single source of truth for the backend API's base URL.
//
// Every page used to hardcode 'http://127.0.0.1:8000' directly, which meant
// this console could never talk to anything but a developer's own machine.
// Set VITE_API_BASE_URL in .env (see .env.example) to point at the real
// backend — it defaults to the local dev server so `npm run dev` still
// works out of the box with no setup.
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://127.0.0.1:8000";
