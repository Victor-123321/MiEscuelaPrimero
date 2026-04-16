# Setup Guide — MiEscuelaPrimero Backend

## Prerequisites

- **Node.js** 18 or higher
- **MySQL** 8.0 or higher
- **npm** 9+

## Installation

### 1. Clone / navigate to the backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mi_escuela_primero
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_strong_random_secret_32_chars_min
```

### 4. Initialize the database

```bash
npm run db:init
```

This will:
1. Create the `mi_escuela_primero` database if it doesn't exist
2. Run all 7 migrations in order
3. Seed default admin user, sample schools, stats, and footer content

Default admin credentials (change immediately in production):
- **Email:** `admin@mpj.org.mx`
- **Password:** `Admin123!`

### 5. Start the server

```bash
npm run dev   # Development (auto-reload)
npm start     # Production
```

## Database Commands

```bash
npm run db:migrate   # Apply pending migrations
npm run db:seed      # Seed data (only if DB is empty)
npm run db:reset     # Drop and reinitialize (DEV ONLY)
npm run db:verify    # Check connection and table count
```

## Running Tests

```bash
npm test                  # All tests
npm run test:unit         # Unit tests
npm run test:integration  # Integration tests (requires test DB)
npm run test:coverage     # Coverage report
```

For integration tests, set `DB_NAME=mi_escuela_primero_test` in your test environment.

## CORS Configuration

The frontend at `http://localhost:5173` (Vite dev server) is allowed by default.

For production, set `CORS_ORIGIN=https://miescuelaprimero.onrender.com` in `.env`.

## Production Deployment (Render)

1. Set all environment variables in the Render dashboard
2. Build command: `npm install`
3. Start command: `npm start`
4. The `db:init` call in `server.js` runs automatically on startup
