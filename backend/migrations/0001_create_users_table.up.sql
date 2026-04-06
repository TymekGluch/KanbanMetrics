CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY UNIQUE,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'user',
    hashed_password VARCHAR(256) NOT NULL CHECK (LENGTH(hashed_password) >= 60),
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users(LOWER(email));
CREATE INDEX idx_users_username ON users(LOWER(name));