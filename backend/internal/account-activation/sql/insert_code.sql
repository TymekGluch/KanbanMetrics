WITH deleted AS (
    DELETE FROM account_codes WHERE user_id = $1
)
INSERT INTO account_codes (user_id)
VALUES ($1)
RETURNING user_id, code, expires_at, is_used;
