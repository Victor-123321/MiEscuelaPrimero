# MiEscuelaPrimero — Backend API

> MiEscuelaPrimero is built under the **Mexicanos Primero Jalisco** initiative, mobilizing people and groups around quality education.
>
> **Misión:** *Sólo la educación de calidad cambia a Jalisco*

![Mexicanos Primero Jalisco Logo](docs/assets/logo/logo_color.png)
<!-- TODO: Add actual logo image from Google Drive ZZ Fotos para Reto Tec -->

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js 4 |
| Database | MySQL 8 (mysql2/promise) |
| Auth | JWT HS256 (jsonwebtoken) |
| Validation | Joi |
| Logging | Winston + Morgan |
| Testing | Jest + Supertest |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# 3. Initialize database (creates DB, runs migrations, seeds)
npm run db:init

# 4. Start development server
npm run dev
```

Server will be available at `http://localhost:3000`.

## Available Scripts

```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Production start
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix lint issues
npm run format       # Run Prettier
npm test             # Run all tests
npm run test:unit    # Unit tests only
npm run test:integration  # Integration tests only
npm run db:init      # Initialize database
npm run db:migrate   # Run pending migrations only
npm run db:seed      # Run seeds only
npm run db:reset     # Drop and reinitialize (dev only)
npm run db:verify    # Test connection and verify tables
```

## API Base URL

```
http://localhost:3000/api/v1
```

See [docs/API.md](docs/API.md) for full endpoint documentation.

## Directory Structure

```
backend/
├── src/
│   ├── app.js              # Express setup (CORS, middleware, routes)
│   ├── config/             # environment, database pool, JWT, constants
│   ├── controllers/        # Request handlers (thin — delegate to services)
│   ├── middleware/         # auth, validation, errorHandler, rateLimiter
│   ├── models/             # Data access (raw SQL queries via mysql2)
│   ├── routes/             # Express routers
│   ├── services/           # Business logic
│   └── utils/              # logger, jwt, helpers, formatters, validators
├── db/
│   ├── init.js             # DB creation + migration + seed orchestration
│   ├── migrations/         # Numbered SQL CREATE TABLE files
│   └── seeds/              # Initial data SQL files
├── tests/
│   ├── unit/
│   └── integration/
├── docs/                   # API.md, SETUP.md, BRAND_GUIDELINES.md, DATABASE.md
├── .env.example
└── server.js               # Entry point
```

## Contributing

Use conventional commit messages: `feat:`, `fix:`, `docs:`, `chore:`, `test:`.
