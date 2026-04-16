CREATE TABLE IF NOT EXISTS footer_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_key VARCHAR(100) UNIQUE NOT NULL,
  content_value TEXT NOT NULL,
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_content_key (content_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
