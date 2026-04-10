DROP INDEX IF EXISTS idx_users_unverified_non_admin_created_at;

ALTER TABLE users
DROP COLUMN IF EXISTS is_account_expiration_details_send;
