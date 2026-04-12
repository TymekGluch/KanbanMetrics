package workspace

import (
	"KanbanMetrics/db"
	"context"
	"embed"
)

//go:embed sql/*.sql
var sqlFiles embed.FS

func dbInsertWorkspace(ctx context.Context, input dbInsertWorkspaceInput) (*Workspace, error) {
	var workspace Workspace

	query, err := sqlFiles.ReadFile("sql/insert_workspace.sql")
	if err != nil {
		return nil, err
	}

	err = db.Pool.QueryRow(ctx, string(query), input.Name, input.OwnerID).Scan(&workspace.ID, &workspace.Name, &workspace.OwnerID, &workspace.CreatedAt, &workspace.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &workspace, nil
}

func dbSelectUserWorkspaceRole(ctx context.Context, userID uint, workspaceID string) (string, error) {
	query, err := sqlFiles.ReadFile("sql/select_user_workspace_permission.sql")
	if err != nil {
		return "", err
	}

	var role string

	err = db.Pool.QueryRow(ctx, string(query), userID, workspaceID).Scan(&role)
	if err != nil {
		return "", err
	}

	return role, nil
}
