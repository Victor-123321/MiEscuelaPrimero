CREATE TABLE IF NOT EXISTS school_needs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT NOT NULL,
  categoria ENUM('Material','Infraestructura','Formación','Salud') NOT NULL,
  subcategoria VARCHAR(255) DEFAULT NULL,
  propuesta TEXT NOT NULL,
  cantidad INT DEFAULT NULL,
  unidad VARCHAR(100) DEFAULT NULL,
  estado ENUM('Cubierto','Aun no cubierto','Cubierto parcialmente') NOT NULL DEFAULT 'Aun no cubierto',
  detalles TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  INDEX idx_school_id (school_id),
  INDEX idx_categoria (categoria),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
