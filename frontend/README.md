# Granger Frontend

Modern project management frontend with a clean navy & blue UI,
internationalization (English/Spanish) and motion.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS
- TanStack Query + Axios
- React Hook Form + Zod
- Framer Motion + @dnd-kit
- React Router

## Demo mode (no backend required)

By default the app talks to the real API. To explore all screens with mock
data (useful for previewing the UI without a running backend), set:

`VITE_DEMO_MODE=true`

Then run `npm run dev`, open http://localhost:5173/ and use the **Demo
screens** panel (bottom-left) to navigate across all pages and modals.

Set it back to `VITE_DEMO_MODE=false` (the default) when you want to talk to
the real API.

## Scripts

- `npm run dev` - development server
- `npm run build` - production build
- `npm run preview` - preview the production build
- `npm run lint` - lint with oxlint
- `npm run e2e` - Playwright end-to-end tests
- `npm run e2e:ui` - Playwright in interactive UI mode
- `npm run e2e:headed` - Playwright with a visible browser
