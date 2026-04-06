UPDATE users
SET
  name = COALESCE($2, name),
  email = COALESCE($3, email),
  role = COALESCE($4, role),
  hashed_password = COALESCE($5, hashed_password),
  is_active = COALESCE($6, is_active),
  is_verified = COALESCE($7, is_verified),
  last_login_at = COALESCE($8, last_login_at),
  updated_at = COALESCE($9, updated_at)
WHERE id = $1