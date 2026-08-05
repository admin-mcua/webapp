-- Admin account: username "admin", password "admin123"
-- password hash = SHA-256 of 'ngl_salt_v1::admin123'
INSERT OR IGNORE INTO users (username, username_lower, password, is_admin)
VALUES ('admin', 'admin', 'e6f62090fd04a24bf620d72d67f40d7eff3ed34ebbe6cd21a84952d65468d5db', 1);
