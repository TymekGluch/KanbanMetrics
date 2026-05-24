INSERT INTO workspaces (name, description, owner_id)
VALUES ($1, $2, $3)
RETURNING id::text, name, description, owner_id, created_at, updated_at;