DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        PERFORM cron.unschedule('delete-expired-account-codes');
    END IF;
END;
$$;

DROP FUNCTION IF EXISTS delete_expired_account_codes();
DROP TABLE IF EXISTS account_codes;