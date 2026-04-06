DROP INDEX IF EXISTS users_email_lower_unique;
DROP INDEX IF EXISTS idx_users_name_lower;
DROP INDEX IF EXISTS idx_users_active;

CREATE INDEX IF NOT EXISTS idx_users_email 
ON users (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_users_username 
ON users (LOWER(name));

ALTER TABLE users 
ALTER COLUMN hashed_password TYPE VARCHAR(256);
CHECK (LENGTH(hashed_password) >= 60);