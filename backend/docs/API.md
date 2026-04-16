# API Documentation — MiEscuelaPrimero

Base URL: `http://localhost:3000/api/v1`

All responses follow this envelope:

```json
{
  "success": true,
  "data": {},
  "message": "Operación completada exitosamente",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "v1"
}
```

Error responses:

```json
{
  "success": false,
  "errors": [{ "field": "email", "message": "El correo no es válido." }],
  "message": "Los datos enviados no son válidos.",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "v1"
}
```

### Status Code Reference

| Code | Color | Meaning |
|------|-------|---------|
| 200 | #009933 (green) | Success |
| 201 | #009933 (green) | Created |
| 204 | #009933 (green) | Deleted (no body) |
| 400 | #EC671B (orange) | Validation error |
| 401 | #000000 (black) | Authentication required |
| 403 | #000000 (black) | Forbidden |
| 404 | #F4981C (yellow) | Not found |
| 409 | #EC671B (orange) | Conflict |
| 500 | #000000 (black) | Internal server error |

---

## Authentication

### POST /auth/login

Login and receive a JWT token.

**Rate limit:** 5 requests per 15 minutes per IP.

**Request body:**
```json
{
  "email": "admin@mpj.org.mx",
  "password": "Admin123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "admin@mpj.org.mx",
      "first_name": "Administrator",
      "last_name": "Sistema",
      "role": "admin"
    }
  },
  "message": "Inicio de sesión exitoso"
}
```

**Response 401:**
```json
{
  "success": false,
  "errors": [{ "message": "Correo o contraseña incorrectos." }],
  "message": "Correo o contraseña incorrectos."
}
```

### POST /auth/logout

Invalidate session (client should discard token). Requires `Authorization: Bearer <token>`.

### POST /auth/verify

Check if a token is still valid. Requires `Authorization: Bearer <token>`.

---

## Schools

### GET /schools

List all active schools with pagination and filters.

**Query parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | int | 20 | Max 100 |
| offset | int | 0 | |
| municipality | string | — | Filter by municipality |
| category | string | — | Filter by category |
| type | string | — | Filter by type |
| urgent | boolean | — | `true` / `false` |
| search | string | — | Searches name, description, municipality |
| sort_by | string | created_at | `id`, `name`, `funding_pct`, `students` |
| sort_order | string | desc | `asc` / `desc` |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Primaria Guadalajara Centro",
      "municipality": "Guadalajara",
      "category": "Infraestructura",
      "type": "Escuela Primaria",
      "description": "...",
      "students": 450,
      "teachers": 18,
      "funding_pct": "45.00",
      "urgent": true,
      "status": "active",
      "school_image_url": null,
      "needs": [
        {
          "id": 1,
          "title": "Libros y Materiales de Lectura",
          "amount_needed": "50000.00",
          "amount_funded": "22500.00",
          "status": "in-progress"
        }
      ]
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 5,
    "pages": 1
  }
}
```

### GET /schools/:id

Get a single school with all needs. Returns 404 if not found.

### POST /schools 🔒

Create a school. Requires admin JWT.

**Request body:**
```json
{
  "name": "Nueva Primaria Tlaquepaque",
  "municipality": "Tlaquepaque",
  "category": "Educación",
  "type": "Escuela Primaria",
  "description": "...",
  "students": 200,
  "teachers": 9,
  "funding_pct": 0,
  "urgent": false
}
```

**Response 201:** Created school object.

### PUT /schools/:id 🔒

Update school fields. Partial updates supported.

### DELETE /schools/:id 🔒

Soft-delete (sets status to `inactive`). Returns **204 No Content**.

### POST /schools/:id/needs 🔒

Add a need to a school.

```json
{
  "title": "Reparación de Baños",
  "description": "...",
  "amount_needed": 30000,
  "amount_funded": 0,
  "status": "open"
}
```

### PUT /schools/:id/needs/:needId 🔒

Update a need.

### DELETE /schools/:id/needs/:needId 🔒

Remove a need. Returns **204 No Content**.

---

## Stats

### GET /stats

Get all hero impact numbers.

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "stat_key": "total_schools", "stat_value": "450", "stat_label": "Escuelas Apoyadas", "display_order": 1 },
    { "stat_key": "total_students", "stat_value": "25,000", "stat_label": "Estudiantes Impactados", "display_order": 2 }
  ]
}
```

### PUT /stats/:statKey 🔒

Update a stat value.

```json
{
  "stat_value": "500",
  "stat_label": "Escuelas Apoyadas"
}
```

---

## Footer Content

### GET /content/footer

Get all footer content as a key-value object.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "contact_email": "contacto@mpj.org.mx",
    "contact_phone": "33 2106 8253",
    "step_1_title": "Descubre",
    "step_1_description": "Explora las escuelas..."
  }
}
```

### PUT /content/footer/:contentKey 🔒

Update a footer content entry.

```json
{
  "content_value": "nuevo@mpj.org.mx"
}
```

---

## File Upload

### POST /upload/schools 🔒

Upload a CSV or XLSX file to bulk-import schools.

**Content-Type:** `multipart/form-data`
**Field name:** `file`

Expected columns: `school_name`, `municipality`, `category`, `type`, `description`, `funding_pct`, `students`, `teachers`, `urgent`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "upload_id": 1,
    "filename": "escuelas_jalisco.csv",
    "rows_processed": 10,
    "rows_successful": 9,
    "rows_failed": 1,
    "errors": [
      { "row": 5, "error": "school_name y municipality son requeridos." }
    ]
  }
}
```

### GET /upload/history 🔒

List past uploads (paginated). Supports `limit` and `offset` query params.

### GET /upload/history/:id 🔒

Get details of a specific upload.

---

## Authentication Header

For all 🔒 protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
