DELETE FROM account_codes WHERE expires_at < NOW();
