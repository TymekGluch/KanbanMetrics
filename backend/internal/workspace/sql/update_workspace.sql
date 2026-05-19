UPDATE workspaces
SET
  name = COALESCE($2, name),
  owner_id = COALESCE($3, owner_id)
  description = COALESCE($4, description),
  updated_at = COALESCE($5, updated_at)
WHERE id = $1