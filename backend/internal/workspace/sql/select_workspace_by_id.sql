SELECT id::text, name, description, owner_id, created_at, updated_at
FROM workspaces
WHERE id = $1