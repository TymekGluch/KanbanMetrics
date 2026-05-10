INSERT INTO users (name, email, hashed_password, role, created_at)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;