# Database Design — MiEscuelaPrimero

Database: **MySQL 8** / charset: `utf8mb4_unicode_ci`

## Entity Relationship Overview

```
admin_users ──< stats (updated_by)
admin_users ──< footer_content (updated_by)
admin_users ──< file_upload_log (upload_by)
admin_users ──< audit_log (admin_id)
schools     ──< school_needs (school_id CASCADE)
```

## Tables

### `admin_users`
Authenticated admin dashboard users.

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AI | |
| email | VARCHAR(255) UNIQUE | Login identifier |
| password_hash | VARCHAR(255) | bcrypt (12 rounds) |
| first_name | VARCHAR(100) | |
| last_name | VARCHAR(100) | |
| role | ENUM('superadmin','admin') | Default: admin |
| is_active | BOOLEAN | Soft disable |
| last_login | TIMESTAMP NULL | |
| created_at / updated_at | TIMESTAMP | Auto-managed |

### `schools`
Core entity — school catalog.

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AI | |
| name | VARCHAR(255) | |
| municipality | VARCHAR(100) | Jalisco municipality |
| category | VARCHAR(100) | e.g. Infraestructura, Educación |
| type | VARCHAR(100) | e.g. Escuela Primaria |
| description | TEXT | |
| students | INT | |
| teachers | INT | |
| funding_pct | DECIMAL(5,2) | 0–100 |
| urgent | BOOLEAN | Priority flag |
| status | ENUM('active','inactive') | Soft delete via inactive |
| school_image_url | VARCHAR(500) | Placeholder for Google Drive asset |
| created_at / updated_at | TIMESTAMP | |

**Indexes:** `municipality`, `category`, `urgent`, `status`

### `school_needs`
Normalized from the `needs[]` array in the React mock data.

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AI | |
| school_id | INT FK | → schools(id) ON DELETE CASCADE |
| title | VARCHAR(255) | |
| description | TEXT | |
| amount_needed | DECIMAL(10,2) | |
| amount_funded | DECIMAL(10,2) | Default 0 |
| status | ENUM('open','funded','in-progress') | |
| created_at / updated_at | TIMESTAMP | |

### `stats`
Hero impact numbers shown on the frontend home page.

| Column | Type | Notes |
|--------|------|-------|
| stat_key | VARCHAR(100) UNIQUE | e.g. `total_schools` |
| stat_value | VARCHAR(500) | Display value |
| stat_label | VARCHAR(255) | Human label |
| display_order | INT | Frontend ordering |
| updated_by | INT FK NULL | → admin_users(id) SET NULL |

### `footer_content`
Key-value store for footer contact info and how-it-works steps.

| Column | Type | Notes |
|--------|------|-------|
| content_key | VARCHAR(100) UNIQUE | e.g. `contact_email`, `step_1_title` |
| content_value | TEXT | |
| updated_by | INT FK NULL | |

### `file_upload_log`
Tracks every CSV/XLSX bulk import.

| Column | Type | Notes |
|--------|------|-------|
| filename | VARCHAR(255) | |
| file_size | INT | Bytes |
| upload_by | INT FK NULL | |
| rows_processed / rows_successful / rows_failed | INT | |
| status | ENUM('pending','processing','completed','failed') | |
| error_message | TEXT | Set on failure |

### `audit_log`
Immutable record of every admin action.

| Column | Type | Notes |
|--------|------|-------|
| admin_id | INT FK NULL | SET NULL on user delete |
| action | VARCHAR(100) | e.g. `create_school`, `login_failed` |
| entity_type | VARCHAR(100) | |
| entity_id | INT | |
| changes | JSON | `{before, after}` |
| ip_address | VARCHAR(45) | |
| user_agent | VARCHAR(500) | |
| timestamp | TIMESTAMP | Immutable |

### `migrations_applied`
Tracks which migration SQL files have been executed (managed by `db/init.js`).

## Migration Order

```
001_create_admin_users_table.sql
002_create_schools_table.sql
003_create_school_needs_table.sql    ← FK → schools
004_create_stats_table.sql           ← FK → admin_users
005_create_footer_content_table.sql  ← FK → admin_users
006_create_file_upload_log_table.sql ← FK → admin_users
007_create_audit_log_table.sql       ← FK → admin_users
```

## CSV/XLSX Upload Column Schema

| Column | Required | Type | Notes |
|--------|----------|------|-------|
| school_name | ✅ | string | |
| municipality | ✅ | string | |
| category | | string | |
| type | | string | |
| description | | string | |
| funding_pct | | number | 0–100 |
| students | | integer | |
| teachers | | integer | |
| urgent | | boolean | true/false/1/0/si/yes |
