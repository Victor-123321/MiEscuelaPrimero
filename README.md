# Mi Escuela Primero
 
Interactive catalog platform connecting donors with public elementary schools in Jalisco, Mexico. Built for the Mexicanos Primero Jalisco social impact initiative.
 
---
 
## Overview
 
Mi Escuela Primero displays the specific needs of public elementary schools — infrastructure repairs, classroom materials, sports equipment, and more — so that companies and individuals can make targeted, traceable donations. The platform is used by the MPJ team to manage school data, track donation leads, and publish updates.
 
---
 
## Architecture
 
```
Frontend (React 19 + Vite 8)   →   Backend (Node.js 20 + Express 4)   →   MySQL (SharkASP)
     Render (static site)               Koyeb (Node builder)
```
 
The frontend is a single-page application with no client-side router — page state is managed with `useState` in `App.jsx`. The backend exposes a REST API under `/api/v1`. All styles are inline `style={{}}` objects; color tokens live in `src/constants/colors.js`.
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 |
| Backend | Node.js 20, Express 4 |
| Database | MySQL 8 via mysql2 |
| Auth | JWT (jsonwebtoken 9), bcrypt |
| Validation | Joi |
| File parsing | xlsx (SheetJS) |
| Testing | Jest 29 (unit + integration) |
| Frontend host | Render |
| Backend host | Koyeb |
| Database host | SharkASP |
 
---
 
## Repository Structure
 
```
mi-escuela-primero/
├── src/
│   ├── App.jsx                    # Routing switch and admin gate
│   ├── constants/colors.js        # Design token palette
│   ├── hooks/                     # useAuth, useSchools, useStats
│   ├── services/api.js            # Fetch wrapper for all API calls
│   ├── pages/                     # CatalogPage, HowItWorksPage, AdminPage
│   └── components/                # Navbar, Footer, SchoolCard, LeadForm, ...
├── backend/
│   ├── server.js                  # Entry point
│   ├── src/
│   │   ├── app.js                 # Express setup (cors, helmet, morgan)
│   │   ├── config/                # DB pool, JWT, env validation
│   │   ├── controllers/           # auth, schools, stats, footer, upload, leads
│   │   ├── middleware/            # JWT auth, error handler, rate limiter, Joi validation
│   │   ├── models/                # AdminUser, School, Stat, FooterContent, FileUploadLog, AuditLog
│   │   ├── routes/                # auth, schools, stats, content, upload, leads
│   │   └── services/              # uploadService (XLSX parsing + DB write)
│   ├── db/
│   │   ├── migrations/            # 001-007 SQL migration files
│   │   └── seeds/                 # Default admin, schools, stats/footer
│   └── tests/
│       ├── unit/                  # Business logic (matching, parsing, validators)
│       └── integration/           # HTTP endpoint tests with mocked DB
├── vite.config.js
└── package.json
```
 
---
 
## Local Setup
 
### Requirements
 
- Node.js 18+
- MySQL 8 (local or remote)
### Frontend
 
```bash
npm install
npm run dev        # http://localhost:5173
```
 
### Backend
 
```bash
cd backend
npm install
npm run db:init        # create DB, run migrations, seed data
npm run dev            # http://localhost:3000
```
 
### Environment variables (backend `.env`)
 
| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default 3306) |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret for signing tokens |
| `JWT_EXPIRES_IN` | Token TTL (default `24h`) |
| `PORT` | Server port |
| `NODE_ENV` | `development` or `production` |
| `BCRYPT_ROUNDS` | Password hash rounds (default 12) |
 
### Environment variables (frontend `.env`)
 
| Variable | Description |
|---|---|
| `VITE_API_URL` | Full base URL of the API, e.g. `https://your-backend.koyeb.app/api/v1` |
 
Note: Vite bakes `VITE_*` variables at build time. The variable must be set in the host's build environment before the build runs, not at runtime.
 
---
 
## Database
 
Seven tables plus a `migrations_applied` tracking table. Migrations run in order from `backend/db/migrations/`. The seed inserts one default admin user and sample school data.
 
```
schools           municipio, escuela, nivel_educativo, cct, estudiantes, ...
school_needs      school_id (FK), categoria, subcategoria, propuesta, estado
admin_users       email, password_hash, role, is_active, last_login
stats             stat_key, stat_value, stat_label
footer_content    content_key, content_value
file_upload_log   filename, status, rows_processed, rows_successful, rows_failed
audit_log         admin_id, action, entity_type, changes (JSON)
```
 
Useful commands:
 
```bash
npm run db:migrate   # apply pending migrations
npm run db:seed      # insert seed data (skips if data already exists)
npm run db:reset     # drop and recreate (development only)
npm run db:verify    # test connection and list table row counts
```
 
---
 
## API
 
Base URL: `/api/v1`. All responses use the envelope `{ success, data, message, timestamp, version }`. Admin endpoints require `Authorization: Bearer <token>`.
 
| Method | Endpoint | Access |
|---|---|---|
| POST | /auth/login | Public |
| POST | /auth/logout | Admin |
| POST | /auth/verify | Admin |
| GET | /schools | Public |
| GET | /schools/filters | Public |
| GET | /schools/:id | Public |
| POST | /schools | Admin |
| PUT | /schools/:id | Admin |
| DELETE | /schools/:id | Admin |
| POST | /schools/:id/needs | Admin |
| PUT | /schools/:id/needs/:needId | Admin |
| DELETE | /schools/:id/needs/:needId | Admin |
| POST | /leads | Public |
| GET | /leads | Admin |
| GET | /leads/:id | Admin |
| PATCH | /leads/:id/status | Admin |
| GET | /stats | Public |
| PUT | /stats/:statKey | Admin |
| GET | /content/footer | Public |
| PUT | /content/footer/:contentKey | Admin |
| POST | /upload/schools | Admin |
| GET | /upload/history | Admin |
| GET | /upload/history/:id | Admin |
 
---
 
## File Upload Format
 
The admin Upload tab expects a two-sheet `.xlsx` file.
 
**Sheet 1 — "Necesidades"** (data from row 4):
`Municipio`, `Escuela`, `Categoria`, `Subcategoria`, `Propuesta`, `Cantidad`, `Unidad`, `Estado`, `Detalles`
 
**Sheet 2 — "Datos de las escuelas"** (data from row 5):
`Municipio`, `Plantel`, `Escuela`, `Personal escolar`, `Estudiantes`, `Nivel ed.`, `CCT`, `Modalidad`, `Turno`, `Sostenimiento`, `Direccion`, `Ubicacion`
 
Upload flow: schools from Sheet 2 are upserted first (by `escuela + municipio`), then needs from Sheet 1 are matched by school name (with accent-insensitive fuzzy matching) and bulk-replaced via `School.replaceNeeds()`.
 
---
 
## Testing
 
```bash
cd backend
npm test                   # all tests
npm run test:unit          # unit tests only
npm run test:integration   # integration tests (requires running backend config)
```
 
Unit tests cover the XLSX parsing logic, school name matching algorithm, and Joi validators. Integration tests spin up the Express app with a mocked database and verify HTTP status codes and response shapes for all major endpoints.
 
---
 
## CI/CD Pipeline
 
```
Developer  ->  git push  ->  GitHub (main branch)
                                    |
                    ----------------+----------------
                    |                               |
               Render build                   Koyeb build
          npm install && build            npm install && test:unit
          publishes /dist                 starts node server.js
                    |                               |
            Frontend live                   Backend live
         (miescuelaprimero.onrender.com)   (*.koyeb.app)
                    |                               |
                    +---------------+---------------+
                                    |
                              MySQL (SharkASP)
```
 
Both services connect to the same SharkASP MySQL instance. Deployments are triggered automatically on every push to `main` and are independent of each other.
 
**Render (Frontend)**
 
Render detects a push to `main`, runs the build command, and serves the static output. The `VITE_API_URL` variable must be set in Render's dashboard before the build runs — Vite replaces it at compile time, not at runtime.
 
| Setting | Value |
|---|---|
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |
| Start command | `npm start` |
 
**Koyeb (Backend)**
 
Koyeb uses the Node.js builder. On every push to `main` it installs dependencies, runs the unit test suite, and starts the server. If the unit tests fail the deployment is cancelled before the new version goes live.
 
| Setting | Value |
|---|---|
| Build command | `npm install && npm run test:unit` |
| Run command | `npm start` |
 
Integration tests are not run in the pipeline because they require a live database connection that is not available in Koyeb's build environment. They are intended to be run locally before pushing.
 
---
 
## License
 
MIT - Mexicanos Primero Jalisco
 
