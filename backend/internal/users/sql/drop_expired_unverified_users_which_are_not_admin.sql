DELETE FROM users
WHERE is_verified = false
AND role = 'user'
AND created_at < (NOW() - COALESCE(NULLIF($1, '')::interval, INTERVAL '12 days'))
RETURNING id, email, name;
