-- School needs: maps exactly to the Excel columns in the screenshot
-- Municipio | Escuela | Categoría | Subcategoría | Propuesta | Cantidad | Unidad | Estado | Detalles
CREATE TABLE IF NOT EXISTS school_needs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  school_id     INT NOT NULL,
  categoria     VARCHAR(100),   -- Col C: Material / Infraestructura / Formación
  subcategoria  VARCHAR(150),   -- Col D: Pizarrones/pintarrones, Construcción materiales…
  propuesta     VARCHAR(500),   -- Col E: exact item/proposal
  cantidad      DECIMAL(10,2),  -- Col F: numeric amount
  unidad        VARCHAR(80),    -- Col G: Piezas / Tonelada / Horas / Costales / Metros cúbicos…
  estado        VARCHAR(60),    -- Col H: Cubierto / Aun no cubierto / Cubierto parcialmente
  detalles      TEXT,           -- Col I: free text details
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  INDEX idx_school_id (school_id),
  INDEX idx_categoria (categoria),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
