SELECT id, name, owner_id, created_at, updated_at
FROM workspaces
WHERE id = $1