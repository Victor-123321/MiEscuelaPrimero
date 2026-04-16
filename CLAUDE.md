# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at http://localhost:5173
npm run build      # Production bundle to /dist
npm run lint       # ESLint (flat config v9)
npm run preview    # Preview production build locally
npm start          # Cloud deploy mode (Render) — uses $PORT env var
```

## Architecture

**Mi Escuela Primero** is a frontend-only React 19 SPA (no backend, no routing library, no state management library). It is a social impact platform for connecting donors with Mexican primary schools.

### Routing

Routing is a plain `switch(page)` in `App.jsx` — no React Router. The page state (`"home" | "how" | "admin"`) lives at the top of `App.jsx` and is passed down as `onNavigate` callbacks.

### Data

All data is mock/static, imported directly into components:

- `src/data/mockSchools.js` — 16+ school records, each with a `needs` array
- `src/data/mockStats.js` — hero impact numbers, footer steps, contact info

The roadmap includes migrating to Supabase; no real database exists yet.

### State Management

No Context API, Redux, or Zustand. State is local `useState` per component, with prop drilling for cross-component data (e.g., admin edit state passed from `App.jsx` down to `AdminPage`).

### Styling

All styles are **inline `style={{}}` objects** — there are no CSS classes or CSS modules in use. SCSS files (`src/styles/`) exist but are mostly empty stubs prepared for a future refactor. The color palette is centralized in `src/constants/colors.js` and should be imported instead of hardcoded hex values.

### Component Structure

```
App.jsx                   ← routing, admin-unlock state
├── Navbar                ← sticky nav, desktop/mobile
├── CatalogPage           ← home: hero stats, filters, school grid
│   ├── Sidebar           ← collapsible filter panel (municipality/category/type)
│   ├── SchoolGrid → SchoolCard
│   └── SchoolDetail      ← modal, contains nested LeadForm
├── HowItWorksPage        ← static 4-step explainer
├── AdminPage             ← 4 tabs: Upload / Stats / Footer / Schools
└── Footer
```

### Admin Dashboard

`AdminPage` has four tabs: **Upload** (CSV/XLSX drag-and-drop), **Stats** (edit hero numbers), **Footer** (edit contact/steps), **Schools** (view/edit/delete schools). Admin access is gated by a password entered in the Navbar; the lock state lives in `App.jsx`.

### File Upload Format

The admin Upload tab expects `.xlsx` or `.csv` with these columns: `school_name`, `municipality`, `category`, `type`, `description`, `funding_pct`, `students`, `teachers`, `urgent`.

### Key Patterns

- Modals are `position: fixed` overlays with click-outside-to-close behavior
- Icons are emoji-based throughout (planned migration to Lucide)
- Fluid sizing uses `clamp()` expressions
- `eslint.config.js` ignores unused vars that are all-caps or start with `_` (constants pattern)

### Deployment

Hosted on Render at `miescuelaprimero.onrender.com`. The `allowedHosts` entry in `vite.config.js` is required for that domain to work.
