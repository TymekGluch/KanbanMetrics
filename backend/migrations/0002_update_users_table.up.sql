DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_username;

ALTER TABLE users 
ALTER COLUMN hashed_password TYPE TEXT;

DO $$
DECLARE
	duplicate_count BIGINT;
BEGIN
	SELECT COUNT(*)
	INTO duplicate_count
	FROM (
		SELECT LOWER(email)
		FROM users
		GROUP BY LOWER(email)
		HAVING COUNT(*) > 1
	) duplicates;

	IF duplicate_count > 0 THEN
		RAISE EXCEPTION 'Cannot create users_email_lower_unique: found % case-insensitive duplicate email group(s). Resolve duplicates first.', duplicate_count;
	END IF;
END
$$;

CREATE UNIQUE INDEX users_email_lower_unique 
ON users (LOWER(email));

CREATE INDEX idx_users_name_lower 
ON users (LOWER(name));

CREATE INDEX idx_users_active 
ON users (is_active);