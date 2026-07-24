SELECT user_id, code, expires_at, is_used
FROM account_codes
WHERE user_id = $1
  AND expires_at > NOW();
