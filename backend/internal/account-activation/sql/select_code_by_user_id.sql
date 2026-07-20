SELECT user_id, code, expires_at
FROM account_codes
WHERE user_id = $1
  AND expires_at > NOW();
