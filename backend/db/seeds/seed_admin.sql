-- Default admin user
-- Password: Admin123! (hashed with bcrypt 12 rounds — replaced by db/init.js at runtime)
INSERT INTO admin_users (email, password_hash, first_name, last_name, role, is_active)
VALUES (
  'admin@mpj.org.mx',
  '__BCRYPT_PLACEHOLDER__',
  'Administrator',
  'Sistema',
  'admin',
  TRUE
);
