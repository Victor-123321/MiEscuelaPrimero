# Claude Code Backend Development Prompt
## Project: MiEscuelaPrimero Backend API System

You are tasked with building a complete, production ready backend API for the MiEscuelaPrimero project under the Mexicanos Primero Jalisco initiative. This backend will serve a React 19 frontend SPA (currently running mock data) and must strictly adhere to the brand identity specifications documented in the provided Manual de Identidad.

### Backend Purpose

Replace the static mock data in the existing React frontend with a real database and RESTful API. The frontend currently uses:
* `src/data/mockSchools.js` — 16+ school records with needs arrays
* `src/data/mockStats.js` — hero impact numbers, footer steps, contact info
* Admin dashboard with CSV/XLSX upload capability (currently non functional)

This backend will provide real data persistence and processing for:
* School catalog and filtering (municipality, category, type, urgency)
* Admin management (create, read, update, delete schools and programs)
* User authentication for admin dashboard (password protected)
* Stats management (hero numbers, footer content)
* File upload processing (CSV/XLSX for bulk school imports)
* Attendance and program tracking for schools

Organization Identity: Mexicanos Primero Jalisco
Motto: Sólo la educación de calidad cambia a Jalisco
Mission: Mobilization of people and groups around an independent and plural civic initiative focused on quality education.

---

## Image Assets and Placeholders

### Image Asset Strategy

Brand images from Mexicanos Primero Jalisco Manual de Identidad and Google Drive will be added as placeholders during development. You will implement the following folder structure to hold image references:

**Backend Documentation Assets** (`docs/assets/`)
```
docs/assets/
├── logo/
│   ├── logo_color.png          [PLACEHOLDER: Green Mexicanos Primero logo]
│   ├── logo_black.png          [PLACEHOLDER: Black version]
│   ├── logo_white.png          [PLACEHOLDER: White version]
│   └── logo_minimal.svg        [PLACEHOLDER: Minimal icon]
├── brand/
│   ├── color_palette.png       [PLACEHOLDER: Color swatches with HEX values]
│   ├── typography.png          [PLACEHOLDER: Font samples Montserrat/Watermelon]
│   ├── brand_guidelines.png    [PLACEHOLDER: Logo usage examples]
│   └── application_examples/
│       ├── business_card.jpg   [PLACEHOLDER: Business card mockup]
│       ├── letterhead.jpg      [PLACEHOLDER: Letterhead mockup]
│       ├── badge.jpg           [PLACEHOLDER: Badge/gafete mockup]
│       └── signage.jpg         [PLACEHOLDER: Signage example]
└── screenshots/
    ├── frontend_home.png       [PLACEHOLDER: Frontend homepage screenshot]
    └── frontend_admin.png      [PLACEHOLDER: Frontend admin dashboard screenshot]
```

### Placeholder Implementation

In markdown documentation files (API.md, BRAND_GUIDELINES.md, etc.), use this format for images:

```markdown
![Mexicanos Primero Jalisco Logo](../../docs/assets/logo/logo_color.png)
<!-- TODO: Add actual logo image from Google Drive ZZ Fotos para Reto Tec -->

![Brand Colors Palette](../../docs/assets/brand/color_palette.png)
<!-- TODO: Download color palette image from Google Drive -->

![Business Card Application](../../docs/assets/brand/application_examples/business_card.jpg)
<!-- TODO: Add business card mockup from Manual de Identidad -->
```

### Frontend Integration Notes

**For the React Frontend** (separate from this backend prompt):
The frontend team should add brand assets to:
```
frontend/src/assets/
├── logos/
│   ├── mexicanos_primero_logo.svg
│   ├── logo_white.png
│   └── favicon.ico
├── brand/
│   ├── colors.json (export from colors.js)
│   └── icons/ (emoji or Lucide icons)
└── mockups/ (UI reference images)
```

**CORS Configuration Note**: When frontend makes requests to backend, ensure CORS_ORIGIN environment variable includes the frontend domain (localhost:5173 for dev, miescuelaprimero.onrender.com for production).

---

## Part 1: Core Technology Stack and Architecture

### Technology Stack

* **Runtime**: Node.js (v18+)
* **Framework**: Express.js
* **Database**: MySQL with promise based drivers (mysql2/promise)
* **Authentication**: JWT (HS256 algorithm)
* **API Testing**: Bruno for API testing and validation
* **Code Quality**: ESLint, Prettier
* **Error Handling**: Structured error responses with proper HTTP status codes
* **Logging**: Morgan for request logging, Winston for application logging
* **Validation**: Joi for schema validation
* **Environment Management**: dotenv for configuration

### Architecture Pattern

* **Approach**: MVC with separation of concerns
* **Code Structure**: Controllers, Services, Models, Routes, Middleware, Utils
* **Async Pattern**: async/await throughout (no callbacks)
* **Database Integrity**: 
  * Transactions for multi step operations
  * Foreign key constraints with CASCADE/RESTRICT rules
  * Database normalization (3NF minimum)
  * Connection pooling with configurable limits
* **API Design**:
  * RESTful endpoints with consistent naming
  * Versioning: /api/v1/...
  * kebab case for routes, snake_case for database columns
  * Comprehensive error handling and validation
  * Pagination support for list endpoints

---

## Part 2: Brand Identity Specifications

### Color Palette

From Manual de Identidad Mexicanos Primero Jalisco:

**Primary Color (Green)**
* Name: Pantone 347 C
* CMYK: C: 93, M: 2, Y: 96, K: 0
* RGB: R: 0, G: 152, B: 69
* HEX: #009933

**Secondary Colors (Complementary)**
* Dark Blue (Pantone 2210 C)
  * CMYK: C: 100, M: 83, Y: 35, K: 21
  * RGB: R: 28, G: 54, B: 97
  * HEX: #1C3661
  
* Orange (Pantone 3564 C)
  * CMYK: C: 0, M: 70, Y: 95, K: 0
  * RGB: R: 236, G: 103, B: 27
  * HEX: #EC671B
  
* Yellow (Pantone 2010 C)
  * CMYK: C: 0, M: 47, Y: 93, K: 0
  * RGB: R: 244, G: 152, B: 28
  * HEX: #F4981C

**Usage Guidelines for Backend Responses**
* Primary Green (#009933): Success, active states, primary actions
* Blue (#1C3661): Info, secondary actions, neutral states
* Orange (#EC671B): Warnings, important notifications
* Yellow (#F4981C): Cautions, pending states
* Black (#000000): Errors, critical notifications

### Typography

**Primary Font: Montserrat**
* Versions: Light, Regular, Italic, Bold
* Usage: All API documentation, written documents, formal communications
* Include in documentation: font family declarations for frontend consumers

**Secondary Font: Watermelon**
* Version: Regular
* Usage: Social media graphics, advertising (frontend only, not for backend docs)
* Do NOT use in backend documentation or API responses

### Logo and Branding Assets

**Logo Usage**
* Include logo reference in API documentation as Markdown image links
* Minimum size: 80px for digital media
* Logo file path in documentation: reference from provided Google Drive assets
* Always maintain 1X safety area around logo in documentation layouts
* Use color version (#009933) as primary, black/white versions as fallback

**Emotional Tone for Communications**
* Professional yet accessible
* Civic minded and collaborative
* Educational and empowering
* Bilingual support (Spanish primary, English secondary)

---

## Part 3: Database Design

### Core Entities and Relationships

Design your database with the following primary entities based on the React frontend structure. The current frontend uses mockSchools.js with schools that have `needs` arrays; the backend will normalize this into proper relational tables.

**Schools Table**
* id (INT, PRIMARY KEY, AUTO_INCREMENT)
* name (VARCHAR(255), NOT NULL)
* municipality (VARCHAR(100), NOT NULL) — Jalisco municipality
* category (VARCHAR(100)) — e.g., "Infrastructure", "Education", "Nutrition"
* type (VARCHAR(100)) — e.g., "Primary School", "Technical School"
* description (TEXT)
* students (INT) — number of students
* teachers (INT) — number of teachers
* funding_pct (DECIMAL(5,2)) — percentage of funding goal met (0-100)
* urgent (BOOLEAN, DEFAULT FALSE) — marked as urgent need
* status (ENUM: 'active', 'inactive') DEFAULT 'active'
* school_image_url (VARCHAR(500)) — [PLACEHOLDER: Path to school image from Google Drive]
* created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
* updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
* INDEX(municipality), INDEX(category), INDEX(urgent)

**School Needs Table** (normalized from needs array in mockSchools)
* id (INT, PRIMARY KEY, AUTO_INCREMENT)
* school_id (INT, FOREIGN KEY references Schools(id) ON DELETE CASCADE)
* title (VARCHAR(255), NOT NULL) — e.g., "Library Books", "Computer Equipment"
* description (TEXT)
* amount_needed (DECIMAL(10,2)) — amount in currency units
* amount_funded (DECIMAL(10,2), DEFAULT 0)
* status (ENUM: 'open', 'funded', 'in-progress') DEFAULT 'open'
* created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
* updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
* FOREIGN KEY (school_id) REFERENCES Schools(id) ON DELETE CASCADE
* INDEX(school_id), INDEX(status)

**Admin Users Table** (for admin dashboard authentication)
* id (INT, PRIMARY KEY, AUTO_INCREMENT)
* email (VARCHAR(255), UNIQUE, NOT NULL)
* password_hash (VARCHAR(255), NOT NULL) — bcrypt hashed
* first_name (VARCHAR(100))
* last_name (VARCHAR(100))
* role (ENUM: 'superadmin', 'admin') DEFAULT 'admin'
* is_active (BOOLEAN, DEFAULT TRUE)
* last_login (TIMESTAMP, NULL)
* created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
* updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
* INDEX(email), INDEX(created_at)

**Stats Table** (for hero numbers and impact metrics shown on frontend)
* id (INT, PRIMARY KEY, AUTO_INCREMENT)
* stat_key (VARCHAR(100), UNIQUE, NOT NULL) — e.g., "total_schools", "total_students", "total_teachers", "schools_helped"
* stat_value (VARCHAR(500), NOT NULL) — e.g., "450", "25,000"
* stat_label (VARCHAR(255)) — e.g., "Schools Supported", "Students Impacted"
* display_order (INT, DEFAULT 0) — for ordering in frontend
* updated_by (INT, FOREIGN KEY references AdminUsers(id) ON DELETE SET NULL)
* updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
* INDEX(stat_key)

**Footer Content Table** (for contact info and step descriptions shown in footer)
* id (INT, PRIMARY KEY, AUTO_INCREMENT)
* content_key (VARCHAR(100), UNIQUE, NOT NULL) — e.g., "contact_email", "contact_phone", "address", "step_1_title", "step_1_desc", "step_2_title", "step_2_desc", etc.
* content_value (TEXT, NOT NULL)
* updated_by (INT, FOREIGN KEY references AdminUsers(id) ON DELETE SET NULL)
* updated_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
* INDEX(content_key)

**File Upload Log Table** (for tracking CSV/XLSX uploads via admin dashboard)
* id (INT, PRIMARY KEY, AUTO_INCREMENT)
* filename (VARCHAR(255), NOT NULL)
* file_size (INT) — in bytes
* upload_by (INT, FOREIGN KEY references AdminUsers(id) ON DELETE SET NULL)
* rows_processed (INT)
* rows_successful (INT)
* rows_failed (INT)
* status (ENUM: 'pending', 'processing', 'completed', 'failed') DEFAULT 'pending'
* error_message (TEXT) — if failed
* created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
* INDEX(upload_by), INDEX(status), INDEX(created_at)

**Audit Log Table** (for tracking all admin modifications)
* id (INT, PRIMARY KEY, AUTO_INCREMENT)
* admin_id (INT, FOREIGN KEY references AdminUsers(id) ON DELETE SET NULL)
* action (VARCHAR(100), NOT NULL) — e.g., "create_school", "update_stats", "upload_file"
* entity_type (VARCHAR(100)) — e.g., "school", "stats", "footer"
* entity_id (INT) — id of the affected entity
* changes (JSON) — what changed (old value, new value)
* ip_address (VARCHAR(45))
* user_agent (VARCHAR(500))
* timestamp (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
* FOREIGN KEY (admin_id) REFERENCES AdminUsers(id) ON DELETE SET NULL
* INDEX(admin_id), INDEX(timestamp), INDEX(entity_type)

### Database Constraints

* All tables: PRIMARY KEY on id field
* All tables: created_at and updated_at timestamps (where applicable)
* Foreign key constraints: ON DELETE CASCADE for data integrity
* Indexes on: frequently queried columns (municipality, category, status, email, content_key)
* No NULL values for required fields
* UNIQUE constraints on: email, stat_key, content_key
* Decimal fields for currency: DECIMAL(10,2) for financial amounts

### Database Migration and Seed Files

**Migration Files (db/migrations/)**

Each migration file must be a complete, idempotent SQL script:

001_create_admin_users_table.sql
```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role ENUM('superadmin', 'admin') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(email),
  INDEX(created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

002_create_schools_table.sql
```sql
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  municipality VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  type VARCHAR(100),
  description TEXT,
  students INT,
  teachers INT,
  funding_pct DECIMAL(5,2),
  urgent BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  school_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(municipality),
  INDEX(category),
  INDEX(urgent),
  INDEX(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

003_create_school_needs_table.sql
```sql
CREATE TABLE IF NOT EXISTS school_needs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount_needed DECIMAL(10,2),
  amount_funded DECIMAL(10,2) DEFAULT 0,
  status ENUM('open', 'funded', 'in-progress') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  INDEX(school_id),
  INDEX(status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

004_create_stats_table.sql
```sql
CREATE TABLE IF NOT EXISTS stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stat_key VARCHAR(100) UNIQUE NOT NULL,
  stat_value VARCHAR(500) NOT NULL,
  stat_label VARCHAR(255),
  display_order INT DEFAULT 0,
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX(stat_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

005_create_footer_content_table.sql
```sql
CREATE TABLE IF NOT EXISTS footer_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_key VARCHAR(100) UNIQUE NOT NULL,
  content_value TEXT NOT NULL,
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX(content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

006_create_file_upload_log_table.sql
```sql
CREATE TABLE IF NOT EXISTS file_upload_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  file_size INT,
  upload_by INT,
  rows_processed INT,
  rows_successful INT,
  rows_failed INT,
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (upload_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX(upload_by),
  INDEX(status),
  INDEX(created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

007_create_audit_log_table.sql
```sql
CREATE TABLE IF NOT EXISTS audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INT,
  changes JSON,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX(admin_id),
  INDEX(timestamp),
  INDEX(entity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Seed Files (db/seeds/)**

seed_admin.sql: Create default admin user (password hashed with bcrypt)
```sql
INSERT INTO admin_users (email, password_hash, first_name, last_name, role, is_active)
VALUES (
  'admin@mpj.org.mx',
  '$2b$12$[bcrypt_hashed_password]',  -- Replace with actual bcrypt hash of 'Admin123!'
  'Administrator',
  'Sistema',
  'admin',
  TRUE
);
```

seed_schools.sql: Create sample schools from Jalisco region with school needs
```sql
-- Insert sample schools
INSERT INTO schools (name, municipality, category, type, description, students, teachers, funding_pct, urgent, status) VALUES
('Primaria Guadalajara Centro', 'Guadalajara', 'Infrastructure', 'Primary School', 'Escuela en el corazón de Guadalajara necesita mejorar sus instalaciones', 450, 18, 45, TRUE, 'active'),
('Colegio Zapopan Futuro', 'Zapopan', 'Education', 'Primary School', 'Institución dedicada a formar líderes del futuro', 320, 14, 65, FALSE, 'active'),
('Escuela Municipal Tonalá', 'Tonalá', 'Nutrition', 'Primary School', 'Escuela municipal comprometida con educación de calidad', 280, 12, 30, TRUE, 'active'),
('Instituto Educativo Puerto Vallarta', 'Puerto Vallarta', 'Infrastructure', 'Technical School', 'Centro educativo con enfoque técnico y profesional', 380, 16, 55, FALSE, 'active'),
('Primaria Colotlán Rural', 'Colotlán', 'Infrastructure', 'Primary School', 'Escuela en zona rural con acceso limitado a recursos', 150, 6, 20, TRUE, 'active');

-- Insert school needs (normalized from needs array)
INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Libros y Materiales de Lectura', 'Se necesitan libros para mejorar la biblioteca escolar', 50000, 22500, 'in-progress'
FROM schools s WHERE s.name = 'Primaria Guadalajara Centro';

INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Reparación de Techo', 'El techo principal requiere reparación urgente', 120000, 0, 'open'
FROM schools s WHERE s.name = 'Primaria Guadalajara Centro';

INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Equipos de Cómputo', 'Se necesitan computadoras para el laboratorio de tecnología', 80000, 52000, 'in-progress'
FROM schools s WHERE s.name = 'Colegio Zapopan Futuro';

INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Programa de Alimentación', 'Apoyo para mantener el programa de desayunos escolares', 45000, 13500, 'in-progress'
FROM schools s WHERE s.name = 'Escuela Municipal Tonalá';

INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Mobiliario Escolar', 'Escritorios y sillas nuevas para aulas', 35000, 0, 'open'
FROM schools s WHERE s.name = 'Instituto Educativo Puerto Vallarta';

INSERT INTO school_needs (school_id, title, description, amount_needed, amount_funded, status)
SELECT s.id, 'Instalación de Agua Potable', 'Proyectto para mejorar acceso a agua potable', 150000, 30000, 'in-progress'
FROM schools s WHERE s.name = 'Primaria Colotlán Rural';
```

seed_footer_and_stats.sql: Create stats and footer content for frontend display
```sql
-- Insert hero stats
INSERT INTO stats (stat_key, stat_value, stat_label, display_order) VALUES
('total_schools', '450', 'Escuelas Apoyadas', 1),
('total_students', '25000', 'Estudiantes Impactados', 2),
('total_teachers', '1200', 'Docentes Beneficiados', 3),
('schools_helped', '150', 'Escuelas Transformadas', 4);

-- Insert footer content (contact information)
INSERT INTO footer_content (content_key, content_value) VALUES
('contact_email', 'contacto@mpj.org.mx'),
('contact_phone', '33 2106 8253'),
('address', 'Av. Pablo Neruda 2560, Providencia, 44630 Guadalajara, Jal.'),
('website', 'www.mexicanosprimerojalisco.org');

-- Insert how it works steps
INSERT INTO footer_content (content_key, content_value) VALUES
('step_1_title', 'Descubre'),
('step_1_description', 'Explora las escuelas y sus necesidades específicas'),
('step_2_title', 'Participa'),
('step_2_description', 'Elige cómo quieres apoyar a la educación'),
('step_3_title', 'Impacta'),
('step_3_description', 'Genera cambio directo en las escuelas de Jalisco'),
('step_4_title', 'Transforma'),
('step_4_description', 'Juntos logramos educación de calidad que cambia Jalisco');

-- Insert social media links
INSERT INTO footer_content (content_key, content_value) VALUES
('social_facebook', '@MexPrimJal'),
('social_twitter', '@Mexicanos1oJal'),
('social_instagram', '@Mexicanos1ojal');
```


### db/init.js Implementation Notes

The init.js file should:

1. **Read Migration Files**
   * Scan db/migrations/ directory
   * Sort files alphanumerically
   * Read file contents with fs.readFileSync()
   * Track which migrations have been applied

2. **Execute Sequentially**
   * For each unapplied migration:
     * Parse SQL statements (handle multiple statements separated by ;)
     * Execute against database
     * Record in migrations_applied table
     * Log progress with timestamps

3. **Seed Data Logic**
   * Check if seeds already applied (query users table for admin user)
   * If no admin user exists, run all seed files
   * Hash passwords using bcrypt during seed (or include hashed values in SQL)
   * Verify seed completion by counting records

4. **Error Recovery**
   * Catch and log SQL errors but continue
   * Provide meaningful error messages
   * Suggest remediation steps
   * Exit with error code 1 if critical operation fails

5. **Connection Management**
   * Use connection pool from config/database.js
   * Always close connections after use
   * Set reasonable timeouts (30 seconds)
   * Handle connection errors gracefully

---

## Part 4: API Endpoints and Standards

### Response Format

All API responses must follow this standardized structure:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "v1"
}
```

Error responses:
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "message": "Validation failed",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "v1"
}
```

### HTTP Status Codes

* 200 OK: Successful GET, PUT, PATCH
* 201 Created: Successful POST
* 204 No Content: Successful DELETE (no response body)
* 400 Bad Request: Validation errors
* 401 Unauthorized: Authentication required
* 403 Forbidden: Insufficient permissions
* 404 Not Found: Resource doesn't exist
* 409 Conflict: Duplicate resource or business logic violation
* 500 Internal Server Error: Unhandled exceptions

### Core API Endpoints

Implement endpoints following RESTful principles to serve the React frontend. The frontend will replace mock data with real API calls.

**Authentication (Admin Dashboard)**
* POST /api/v1/auth/login (Admin login with password, return JWT)
* POST /api/v1/auth/logout (Invalidate token)
* POST /api/v1/auth/verify (Verify current JWT token validity)

**Schools** (primary endpoint for catalog page)
* GET /api/v1/schools (List all schools with pagination and filters)
  * Query params: limit, offset, municipality, category, type, urgent, search
  * Returns: schools array with needs array included
* GET /api/v1/schools/:id (Get single school detail with full needs array)
* POST /api/v1/schools (Create new school, admin only)
* PUT /api/v1/schools/:id (Update school details, admin only)
* DELETE /api/v1/schools/:id (Mark school as inactive, admin only)

**School Needs** (related to schools)
* POST /api/v1/schools/:id/needs (Add new need to school, admin only)
* PUT /api/v1/schools/:id/needs/:need-id (Update school need, admin only)
* DELETE /api/v1/schools/:id/needs/:need-id (Remove need from school, admin only)

**Stats** (hero numbers on home page)
* GET /api/v1/stats (Get all stats for display on frontend)
  * Returns: { total_schools, total_students, total_teachers, schools_helped }
* PUT /api/v1/stats/:stat-key (Update stat value, admin only)

**Footer Content** (contact info and how it works steps)
* GET /api/v1/content/footer (Get all footer content)
  * Returns: contact_email, contact_phone, address, step_1_title, step_1_desc, step_2_title, step_2_desc, etc.
* PUT /api/v1/content/footer/:content-key (Update footer content, admin only)

**File Upload** (CSV/XLSX bulk school import for admin)
* POST /api/v1/upload/schools (Upload CSV/XLSX file with school data)
  * Accepts multipart/form-data with file and password fields
  * Processes rows and creates/updates schools in bulk
  * Returns: upload status, rows_processed, rows_successful, rows_failed, errors array
* GET /api/v1/upload/history (Get list of past uploads, admin only)
* GET /api/v1/upload/history/:id (Get details of specific upload)

### Query Parameters for List Endpoints

All list endpoints must support:
* limit (INT, default 20, max 100): Items per page
* offset (INT, default 0): Pagination offset
* sort_by (STRING, default 'created_at'): Sort field
* sort_order (STRING, enum: 'asc', 'desc', default 'desc'): Sort direction
* search (STRING): Full text search on relevant fields
* filter (JSON): Additional filtering (status, date range, etc.)

Response includes:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150,
    "pages": 8
  }
}
```

---

## Part 5: Security and Authentication

### JWT Configuration

* **Algorithm**: HS256
* **Access Token Expiration**: 1 hour
* **Refresh Token Expiration**: 7 days
* **Secret Key**: Store in environment variable (JWT_SECRET)
* **Token Claims**: Include user_id, role, email, iat, exp

### Authentication Middleware

* Validate JWT on all protected routes
* Extract user context from token
* Implement role based access control (RBAC)
* Log authentication failures for audit trail

### Password Security

* Hash passwords with bcrypt (salt rounds: 12)
* Enforce minimum 8 character password requirement
* Implement rate limiting on login (max 5 attempts per 15 minutes)
* Log all authentication events to audit_log table

### API Security Headers

* Implement CORS with whitelist
* Add security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
* Implement CSRF protection if using cookies
* Validate and sanitize all inputs

---

## Part 6: Error Handling and Validation

### Input Validation

Use Joi for schema validation:
* Email format validation
* Password strength validation
* Date format validation (ISO 8601)
* Enum validation for status fields
* Length constraints on text fields

### Custom Error Classes

Create structured error handling:
* ValidationError (400)
* AuthenticationError (401)
* AuthorizationError (403)
* NotFoundError (404)
* ConflictError (409)
* InternalServerError (500)

### Error Logging

* Log all errors with timestamp, user_id, action, and stack trace
* Include request context in logs
* Store critical errors in database audit_log table
* Never expose internal error details to client

---

## Part 7: Database Migrations and Seeding

### Migration Strategy

Create migration files for:
* Initial schema creation (all tables and relationships)
* Indexes and constraints
* Seed data for testing (admin user, sample schools, sample programs)

### Seed Data

Include seed scripts to populate:
* Default admin user (email: admin@mpj.org.mx, role: admin)
* Sample schools from Jalisco region
* Sample programs and initiatives
* Sample users with different roles

---

## Part 7.5: Database Initialization (db/init.js)

### Purpose

The `db/init.js` file is the orchestration layer for complete database setup. It is responsible for:
* Creating the MySQL database if it does not exist
* Running all migrations in order
* Populating seed data for development
* Verifying database health and connectivity
* Providing a single entry point for database initialization

### db/init.js Requirements

Create a comprehensive initialization script that:

**1. Database Creation**
* Connect to MySQL server (without specifying a database initially)
* Create the database with name from DB_NAME environment variable (default: mi_escuela_primero)
* Set character set to utf8mb4 for full Unicode support
* Handle database already exists scenario gracefully

**2. Migration Execution**
* Read all SQL files from db/migrations/ directory in alphanumeric order
* Execute each migration file sequentially
* Track executed migrations in a migrations_applied table to prevent re running
* migrations_applied table schema:
  ```sql
  CREATE TABLE IF NOT EXISTS migrations_applied (
    id INT AUTO_INCREMENT PRIMARY KEY,
    migration_name VARCHAR(255) UNIQUE NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  ```
* If migration already applied, skip it
* Continue with next migration even if one fails (log error but do not stop)
* Log migration execution with timestamps

**3. Seed Data Population**
* Only run seeds if database is empty (check if users table has rows)
* Execute seed files in order: seed_admin.sql, seed_schools.sql, seed_sample_data.sql
* Create default admin user with:
  * email: admin@mpj.org.mx
  * password: hashed (use bcrypt with 12 rounds)
  * role: admin
  * name: Administrator
  * Log the default credentials to console with warning message
* Populate 3 sample schools from Jalisco region
* Populate 5 sample programs
* Populate 10 sample users with different roles
* Make all seed data deterministic (same results each run)

**4. Connection Verification**
* Test database connection after initialization
* Verify all expected tables exist
* Count records in each table and log summary
* Return success or failure status

**5. Export Functions**
Export the following functions for use in server startup:

```javascript
module.exports = {
  initializeDatabase,  // Main initialization function
  runMigrations,       // Run only migrations
  runSeeds,           // Run only seeds
  verifyConnection,   // Test connection
  dropDatabase,       // Drop database (dev only, protected)
  resetDatabase       // Drop and reinitialize (dev only, protected)
}
```

### db/init.js Usage

**Integration with server.js:**
```javascript
// In server.js
const { initializeDatabase } = require('./db/init');

async function startServer() {
  try {
    await initializeDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`MiEscuelaPrimero server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

**CLI Usage (optional npm scripts in package.json):**
```json
{
  "scripts": {
    "db:init": "node db/init.js",
    "db:migrate": "node -e \"require('./db/init').runMigrations()\"",
    "db:seed": "node -e \"require('./db/init').runSeeds()\"",
    "db:reset": "node -e \"require('./db/init').resetDatabase()\"",
    "db:verify": "node -e \"require('./db/init').verifyConnection()\""
  }
}
```

### Error Handling in db/init.js

* If database creation fails: log error and exit process
* If migration fails: log error, skip that migration, continue
* If seed fails: log warning but continue
* If connection verification fails: log error and exit process
* All errors should include:
  * Clear error message
  * SQL error code (if applicable)
  * Suggestion for resolution
  * Timestamp

### Logging in db/init.js

Use Winston logger with timestamps:
```
[INFO] Attempting to create database: mi_escuela_primero
[SUCCESS] Database created successfully
[INFO] Running migrations...
[INFO] Executing migration: 001_create_users_table.sql
[SUCCESS] Migration 001_create_users_table.sql completed
[INFO] Running seed data population...
[SUCCESS] Default admin user created: admin@mpj.org.mx
[INFO] Database initialization complete. Summary:
  - Tables created: 7
  - Migrations applied: 7
  - Sample users: 10
  - Sample schools: 3
  - Sample programs: 5
```

### Environment Variable Requirements for db/init.js

* DB_HOST: MySQL server host (default: localhost)
* DB_PORT: MySQL server port (default: 3306)
* DB_USER: MySQL user (default: root)
* DB_PASSWORD: MySQL password (default: empty)
* DB_NAME: Database name (default: mi_escuela_primero)
* NODE_ENV: Environment (development|production|test)

### db/init.js Security Considerations

* Never log passwords (use asterisks or omit)
* Restrict dropDatabase and resetDatabase to development environment only
* Add confirmation prompt before destructive operations
* Log all database operations for audit trail
* Use parameterized queries to prevent SQL injection in migration reading

### db/init.js Performance

* Use connection pooling for database operations
* Execute migrations in sequence (not parallel) to maintain order
* Pre read all migration files before execution
* Close database connections properly after completion
* Add timeout protection for long running operations (default 30 seconds per migration)

---

## Part 9: File Structure

```
mi-escuela-primero-backend/
├── src/
│   ├── config/
│   │   ├── database.js (Connection pool and configuration)
│   │   ├── environment.js (Environment variable validation)
│   │   ├── constants.js (Brand colors, status enums, error codes)
│   │   └── jwt.js (JWT configuration)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── schoolController.js
│   │   ├── programController.js
│   │   ├── eventController.js
│   │   ├── attendanceController.js
│   │   ├── statsController.js
│   │   └── index.js
│   ├── models/
│   │   ├── User.js
│   │   ├── School.js
│   │   ├── Program.js
│   │   ├── Event.js
│   │   ├── Attendance.js
│   │   ├── AuditLog.js
│   │   └── index.js
│   ├── services/
│   │   ├── authService.js (User registration, login logic)
│   │   ├── userService.js (User CRUD operations)
│   │   ├── schoolService.js (School management)
│   │   ├── programService.js (Program management)
│   │   ├── eventService.js (Event management)
│   │   ├── attendanceService.js (Attendance tracking)
│   │   ├── statsService.js (Statistics and reporting)
│   │   ├── emailService.js (Email notifications)
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── schools.routes.js
│   │   ├── programs.routes.js
│   │   ├── events.routes.js
│   │   ├── stats.routes.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js (JWT verification and RBAC)
│   │   ├── validation.js (Joi schema validation)
│   │   ├── errorHandler.js (Global error handling)
│   │   ├── requestLogger.js (Morgan and Winston logging)
│   │   ├── rateLimiter.js (Rate limiting for login, password reset)
│   │   └── index.js
│   ├── utils/
│   │   ├── validators.js (Custom validation functions)
│   │   ├── formatters.js (Response formatting, date formatting)
│   │   ├── helpers.js (Utility functions, hash passwords)
│   │   ├── jwt.js (Token generation and verification)
│   │   └── errorMessages.js (Standardized error messages)
│   └── app.js (Express app initialization)
├── db/
│   ├── init.js (Database initialization, creation, and migration orchestration)
│   ├── migrations/
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_schools_table.sql
│   │   ├── 003_create_programs_table.sql
│   │   ├── 004_create_participants_table.sql
│   │   ├── 005_create_events_table.sql
│   │   ├── 006_create_attendance_table.sql
│   │   └── 007_create_audit_log_table.sql
│   └── seeds/
│       ├── seed_admin.sql
│       ├── seed_schools.sql
│       └── seed_sample_data.sql
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.js
│   │   ├── users.test.js
│   │   ├── programs.test.js
│   │   └── events.test.js
│   └── setup.js (Test database and fixtures)
├── docs/
│   ├── API.md (Complete API documentation)
│   ├── SETUP.md (Setup and deployment instructions)
│   ├── BRAND_GUIDELINES.md (Brand colors, tone, asset references)
│   └── DATABASE.md (Schema documentation)
├── .env.example (Environment template)
├── .gitignore
├── .eslintrc.json
├── .prettierrc.json
├── package.json
├── server.js (Entry point)
└── README.md (Project overview with logo reference)
```

---

## Part 10: Documentation Requirements

### API Documentation (API.md)

Include for each endpoint:
* HTTP method and path
* Authentication requirement and roles
* Request body schema with examples
* Response schema with examples (200, 400, 401, etc.)
* Query parameters and pagination
* Error scenarios and messages
* Bruno collection export for testing

### Brand Guidelines Document (BRAND_GUIDELINES.md)

* Color palette with HEX/RGB/CMYK values
* Typography specifications with font names
* Logo usage rules and minimum sizes
* Tone guidelines (professional, accessible, civic minded)
* Reference to Mexicanos Primero Jalisco mission
* Include high resolution logo images from Google Drive assets

### Setup Guide (SETUP.md)

* Prerequisites (Node.js version, MySQL version)
* Database setup and migration instructions
* Environment variable configuration
* Installation and running locally
* Docker setup if applicable
* Testing instructions

### README.md

* Project name: MiEscuelaPrimero
* Brief description referencing Mexicanos Primero Jalisco
* Include logo image link
* Quick start guide
* Tech stack listing
* Directory structure overview
* Contributing guidelines

---

## Part 11: Code Quality Standards

### ESLint Configuration

* Use airbnb base config
* Enforce async/await patterns
* No console.log in production (use logger)
* Require error handling in catch blocks
* Enforce naming conventions (camelCase for variables, PascalCase for classes)

### Code Style (Prettier)

* Print width: 100 characters
* Tab width: 2 spaces
* Single quotes
* Semicolons required
* Trailing commas: es5

### Logging Standards

* Use Winston logger (not console.log)
* Log levels: error, warn, info, debug
* Include timestamp, level, message, and context
* Log authentication attempts (success and failures)
* Log database operations (slow queries)
* Store critical errors in audit_log table

### Git Commit Messages

* Use conventional commits: feat:, fix:, docs:, chore:, test:
* Reference task IDs when applicable
* Keep first line under 50 characters

---

## Part 12: Testing Strategy

### Unit Tests

* Test services with mocked database
* Test validators and formatters
* Test error handling and edge cases
* Aim for 80% code coverage on services

### Integration Tests

* Test complete request/response flow
* Use test database (separate MySQL instance)
* Test authentication and authorization
* Test database transactions and rollbacks
* Cleanup test data after each test

### Testing Framework

* Jest for test runner
* Supertest for HTTP testing
* Factory Boy or similar for test fixtures

---

## Part 13: Deployment and Environment Configuration

### Environment Variables

Create .env.example with:
```
NODE_ENV=development|production|test
PORT=3000
LOG_LEVEL=info|debug|error
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mi_escuela_primero
DB_USER=root
DB_PASSWORD=
JWT_SECRET=[strong_random_string]
JWT_EXPIRATION=3600
REFRESH_TOKEN_EXPIRATION=604800
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=900000
CORS_ORIGIN=http://localhost:3000
EMAIL_SERVICE=gmail|sendgrid
EMAIL_FROM=noreply@mpj.org.mx
```

### Deployment Checklist

* Environment variables configured
* Database migrations run
* Seed data loaded
* SSL certificate configured
* Logging configured
* Database backups scheduled
* Error monitoring (Sentry or similar)
* Performance monitoring
* CORS properly configured for frontend domains

---

## Part 14: Additional Features

### Email Notifications

Implement emailService.js for:
* Welcome email on user registration
* Password reset email
* Event notifications
* Program enrollment confirmations
* Use professional HTML templates with Mexicanos Primero branding

### Audit Trail

All modifications tracked in audit_log:
* User who made the change
* What entity was modified
* What changed (old value, new value in JSON)
* Timestamp and IP address
* Action type (create, update, delete)

### Soft Deletes

Implement soft deletes for Users (add deleted_at timestamp):
* Users can be deactivated instead of permanently deleted
* Maintain referential integrity
* Filter out deleted records in queries by default

---

## Part 15: Brand Integration in Documentation

### Documentation Styling

* Use green (#009933) for headings in Markdown documentation
* Include Mexicanos Primero Jalisco logo at top of README
* Reference brand colors in API documentation for status codes:
  * Success (Green #009933)
  * Info (Blue #1C3661)
  * Warning (Orange #EC671B)
  * Caution (Yellow #F4981C)
  * Error (Black #000000)

### Error Messages Tone

* Professional but accessible language
* Use Spanish as primary, English as secondary
* Emphasize educational and civic mission
* Be helpful and constructive in error messages
* Example: "No se pudo enviar el correo. Por favor, verifica tu dirección de correo electrónico e intenta de nuevo."

### Mission Statement in Documentation

Include in README and relevant docs:
"MiEscuelaPrimero is built under Mexicanos Primero Jalisco initiative, mobilizing people and groups around quality education. Our mission: Sólo la educación de calidad cambia a Jalisco"

---

## Deliverables Summary

Your Claude Code implementation must produce:

1. **Complete Backend System**
   * All controllers, services, models, and routes
   * Database migrations and seed scripts
   * Authentication and authorization system
   * Error handling and logging

2. **API Documentation**
   * Complete endpoint documentation in Markdown
   * Request and response examples
   * Bruno collection file for testing
   * Error codes and handling guide

3. **Configuration Files**
   * .env.example with all required variables
   * ESLint and Prettier configuration
   * Database connection configuration

4. **Database Design**
   * SQL migration files
   * Seed data files
   * Indexes and constraints

5. **Brand Integrated Documentation**
   * Brand guidelines with color references and imagery
   * Setup guide with brand context
   * README with logo and mission statement
   * API documentation with brand colors for status codes

6. **Ready to Deploy**
   * All code follows best practices
   * Proper error handling throughout
   * Security measures implemented
   * Logging and monitoring configured
   * Tests included for critical paths

---

## Important Notes

* The project serves the Mexicanos Primero Jalisco mission: quality education transformation in Jalisco
* All documentation should reference the brand identity specifications
* Use provided Google Drive assets (logos, mockups) as references in documentation
* Ensure Spanish language support (emails, error messages, documentation options)
* Prioritize data integrity with proper database constraints and transactions
* Implement comprehensive logging for audit and debugging purposes
* All responses must follow the standardized JSON format specified
* Security is paramount: validate inputs, hash passwords, implement rate limiting, use HTTPS
