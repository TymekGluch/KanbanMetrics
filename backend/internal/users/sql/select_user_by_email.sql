SELECT id, name, email, role, hashed_password, is_active, is_verified, is_account_expiration_details_send, last_login_at, updated_at, created_at
FROM users
WHERE email = $1