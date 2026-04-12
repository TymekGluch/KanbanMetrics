SELECT CASE
	WHEN w.owner_id = $1 THEN 'workspace_owner'
	ELSE wm.role
END AS role
FROM workspaces w
LEFT JOIN workspace_members wm
	ON wm.workspace_id = w.id
 AND wm.user_id = $1
WHERE w.id = $2
AND (
	w.owner_id = $1
	OR wm.user_id IS NOT NULL
);
