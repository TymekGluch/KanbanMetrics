INSERT INTO workspaces (name, owner_id)
VALUES ($1, $2)
RETURNING id::text, name, owner_id, created_at, updated_at;