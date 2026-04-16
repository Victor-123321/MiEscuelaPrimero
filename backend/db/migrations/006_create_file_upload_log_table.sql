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
  INDEX idx_upload_by (upload_by),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
