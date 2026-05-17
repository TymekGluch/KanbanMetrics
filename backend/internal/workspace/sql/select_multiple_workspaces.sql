SELECT workspaces.id::text, workspaces.name, workspaces.description, workspaces.owner_id, workspaces.created_at, workspaces.updated_at
FROM workspaces
WHERE (
	$1::boolean = TRUE
	AND $2::bigint IS NULL
	AND $3::bigint IS NULL
)
OR (
	$2::bigint IS NOT NULL
	AND (
		workspaces.owner_id = $2::bigint
		OR EXISTS (
			SELECT 1
			FROM workspace_members
			WHERE workspace_members.workspace_id = workspaces.id
				AND workspace_members.user_id = $2::bigint
		)
	)
)
OR (
	$3::bigint IS NOT NULL
	AND workspaces.owner_id = $3::bigint
)
ORDER BY workspaces.created_at DESC, workspaces.id DESC
LIMIT $4::int
OFFSET $5::int;
