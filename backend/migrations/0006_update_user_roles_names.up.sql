UPDATE users
SET role = 'app_admin'
WHERE role = 'admin';

UPDATE users
SET role = 'app_user'
WHERE role = 'user';

ALTER TABLE users
ALTER COLUMN role SET DEFAULT 'app_user';
