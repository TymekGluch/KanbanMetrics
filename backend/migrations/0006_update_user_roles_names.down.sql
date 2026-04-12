UPDATE users
SET role = 'admin'
WHERE role = 'app_admin';

UPDATE users
SET role = 'user'
WHERE role = 'app_user';

ALTER TABLE users
ALTER COLUMN role SET DEFAULT 'user';
