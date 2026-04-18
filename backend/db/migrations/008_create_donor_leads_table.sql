-- Donor leads: full form data per the MPJ spec
CREATE TABLE IF NOT EXISTS donor_leads (
  id                    INT AUTO_INCREMENT PRIMARY KEY,

  -- Contacto del aliado
  nombre_completo       VARCHAR(255) NOT NULL,
  tipo_instancia        VARCHAR(100) NOT NULL,   -- Empresa / OSC / Inst.educativa / Gobierno / Ninguna / Otro
  tipo_instancia_otro   VARCHAR(255),             -- free text when tipo_instancia = 'Otro'
  nombre_instancia      VARCHAR(255),
  email                 VARCHAR(255) NOT NULL,
  celular               VARCHAR(30),
  municipio_estado      VARCHAR(150),
  acepta_privacidad     BOOLEAN NOT NULL DEFAULT FALSE,

  -- Donativo
  tipo_donativo         VARCHAR(100) NOT NULL,    -- category from the 16-option list
  tipo_donativo_otro    VARCHAR(255),             -- free text when tipo_donativo = 'Otro'

  -- Shared: target schools (JSON array of school ids / names)
  escuelas_destino      TEXT,                     -- JSON array

  -- For: Formación / Atención psicológica
  tema_formacion        VARCHAR(500),
  publico_dirigido      VARCHAR(255),             -- estudiantes / docentes / familias
  num_horas_sesiones    VARCHAR(100),
  archivo_propuesta_url VARCHAR(500),

  -- For: Material / Mobiliario
  articulo_donar        VARCHAR(500),
  cantidad_articulos    INT,
  opcion_flete          VARCHAR(100),             -- hasta_escuela / oficina / recoger
  direccion_recoleccion TEXT,
  archivo_articulos_url VARCHAR(500),

  -- For: Acceso / Salud / Visitas / Gestión / Otro
  descripcion_apoyo     TEXT,
  archivo_apoyo_url     VARCHAR(500),

  -- Meta
  status                ENUM('nuevo','contactado','completado','cancelado') DEFAULT 'nuevo',
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_tipo_donativo (tipo_donativo),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
