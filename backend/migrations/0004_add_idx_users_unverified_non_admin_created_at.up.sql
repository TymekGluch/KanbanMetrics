ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_account_expiration_details_send BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_unverified_non_admin_created_at
ON users (created_at)
WHERE is_verified = false AND role = 'user';
