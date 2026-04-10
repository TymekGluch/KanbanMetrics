SELECT id, created_at, is_verified, email
FROM users
WHERE is_verified = false
AND role = 'user'
AND is_account_expiration_details_send = false
AND created_at <= (NOW() - COALESCE(NULLIF($1, '')::interval, INTERVAL '9 days'))
AND created_at > (NOW() - COALESCE(NULLIF($2, '')::interval, INTERVAL '11 days 23 hours'));
