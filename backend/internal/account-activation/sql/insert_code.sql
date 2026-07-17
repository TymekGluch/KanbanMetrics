INSERT INTO account_codes (user_id)
VALUES ($1)
RETURNING user_id, code, expires_at;
