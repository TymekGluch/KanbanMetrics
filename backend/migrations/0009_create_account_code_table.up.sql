CREATE TABLE IF NOT EXISTS account_codes (
    user_id  BIGINT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code     CHAR(6) NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 1000000)::BIGINT::TEXT, 6, '0'),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 hour'
);

CREATE INDEX idx_account_codes_user_id   ON account_codes(user_id);
CREATE INDEX idx_account_codes_expires_at ON account_codes(expires_at);

CREATE OR REPLACE FUNCTION delete_expired_account_codes()
RETURNS void LANGUAGE sql AS $$
    DELETE FROM account_codes WHERE expires_at < NOW();
$$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        PERFORM cron.schedule(
            'delete-expired-account-codes',
            '* * * * *',
            'SELECT delete_expired_account_codes()'
        );
    END IF;
END;
$$;
