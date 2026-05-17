package workspace

import (
	"KanbanMetrics/db"
	"context"
	"embed"
	"fmt"
)

//go:embed sql/*.sql
var sqlFiles embed.FS

func dbInsertWorkspace(ctx context.Context, input dbInsertWorkspaceInput) (*Workspace, error) {
	var workspace Workspace

	query, err := sqlFiles.ReadFile("sql/insert_workspace.sql")
	if err != nil {
		return nil, err
	}

	err = db.Pool.QueryRow(ctx, string(query), input.Name, input.Description, input.OwnerID).Scan(
		&workspace.ID,
		&workspace.Name,
		&workspace.Description,
		&workspace.OwnerID,
		&workspace.CreatedAt,
		&workspace.UpdatedAt,
	)
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

func dbSelectWorkspaceByID(ctx context.Context, workspaceID string) (*Workspace, error) {
	query, err := sqlFiles.ReadFile("sql/select_workspace_by_id.sql")
	if err != nil {
		return nil, err
	}

	var workspace Workspace

	err = db.Pool.QueryRow(ctx, string(query), workspaceID).Scan(
		&workspace.ID,
		&workspace.Name,
		&workspace.Description,
		&workspace.OwnerID,
		&workspace.CreatedAt,
		&workspace.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &workspace, nil
}

func dbSelectMultipleWorkspaces(ctx context.Context, input dbSelectMultipleWorkspacesInput) ([]Workspace, error) {
	query, err := sqlFiles.ReadFile("sql/select_multiple_workspaces.sql")
	if err != nil {
		return nil, err
	}

	var filterUserID any
	if input.FilterUserID != nil {
		filterUserID = *input.FilterUserID
	}

	var filterOwnerID any
	if input.FilterOwnerID != nil {
		filterOwnerID = *input.FilterOwnerID
	}

	rows, err := db.Pool.Query(
		ctx,
		string(query),
		input.IsAdmin,
		filterUserID,
		filterOwnerID,
		input.Limit,
		input.Offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	workspaces := make([]Workspace, 0, input.Limit)

	for rows.Next() {
		var foundWorkspace Workspace

		if err := rows.Scan(
			&foundWorkspace.ID,
			&foundWorkspace.Name,
			&foundWorkspace.Description,
			&foundWorkspace.OwnerID,
			&foundWorkspace.CreatedAt,
			&foundWorkspace.UpdatedAt,
		); err != nil {
			return nil, err
		}

		workspaces = append(workspaces, foundWorkspace)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return workspaces, nil
}

func dbDropWorkspace(ctx context.Context, input dbDropWorkspaceInput) error {
	query, err := sqlFiles.ReadFile("sql/drop_workspace.sql")
	if err != nil {
		return err
	}

	rows, err := db.Pool.Query(ctx, string(query), input.ID)
	if err != nil {
		return err
	}
	defer rows.Close()

	if !rows.Next() {
		return fmt.Errorf("workspace not found")
	}

	return nil
}
