-- Schools: one row per school (Municipio + Escuela from the Excel)
CREATE TABLE IF NOT EXISTS schools (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,          -- "Escuela" column
  municipality    VARCHAR(100) NOT NULL,           -- "Municipio" column
  type            VARCHAR(100),                    -- Primaria / Preescolar / Secundaria…
  description     TEXT,
  students        INT DEFAULT 0,
  teachers        INT DEFAULT 0,
  urgent          BOOLEAN DEFAULT FALSE,
  status          ENUM('active','inactive') DEFAULT 'active',
  school_image_url VARCHAR(500),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_municipality (municipality),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
