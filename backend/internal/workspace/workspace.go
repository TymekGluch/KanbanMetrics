package workspace

import (
	"context"
	"time"
)

func CreateWorkspace(ctx context.Context, input CreateWorkspaceInput) (*Workspace, error) {
	dbInput := dbInsertWorkspaceInput{
		Name:        input.Name,
		Description: input.Description,
		OwnerID:     input.OwnerID,
	}

	return dbInsertWorkspace(ctx, dbInput)
}

func GetUserWorkspaceRole(ctx context.Context, userID uint, workspaceID string) (string, error) {
	return dbSelectUserWorkspaceRole(ctx, userID, workspaceID)
}

func GetWorkspaceByID(ctx context.Context, workspaceID string) (*Workspace, error) {
	return dbSelectWorkspaceByID(ctx, workspaceID)
}

func GetWorkspaces(ctx context.Context, input ListWorkspacesInput) (*ListWorkspacesResult, error) {
	dbInput := dbSelectMultipleWorkspacesInput{
		IsAdmin:       input.IsAdmin,
		FilterUserID:  input.FilterUserID,
		FilterOwnerID: input.FilterOwnerID,
		Limit:         input.Limit,
		Offset:        input.Offset,
	}

	workspaces, err := dbSelectMultipleWorkspaces(ctx, dbInput)
	if err != nil {
		return nil, err
	}

	return &ListWorkspacesResult{
		Items:  workspaces,
		Limit:  input.Limit,
		Offset: input.Offset,
	}, nil
}

func DropWorkspace(ctx context.Context, workspaceID string) error {
	dbInput := dbDropWorkspaceInput{
		ID: workspaceID,
	}

	return dbDropWorkspace(ctx, dbInput)
}

func UpdateWorkspace(ctx context.Context, input UpdateWorkspaceInput) error {
	dbInput := dbUpdateWorkspaceInput{
		ID:          input.WorkspaceID,
		Name:        input.Name,
		Description: input.Description,
		OwnerID:     input.NewOwnerID,
		UpdatedAt:   input.UpdatedAt,
	}

	return dbUpdateWorkspace(ctx, dbInput)
}

func TransferWorkspaceOwnership(ctx context.Context, workspaceID string, newOwnerID int64) error {
	return UpdateWorkspace(ctx, UpdateWorkspaceInput{
		WorkspaceID: workspaceID,
		NewOwnerID:  &newOwnerID,
	})
}

func MarkWorkspaceUpdated(ctx context.Context, input MarkWorkspaceUpdatedInput) error {
	if input.UpdatedAt == nil {
		now := time.Now()
		input.UpdatedAt = &now
	}

	dbInput := dbUpdateWorkspaceInput{
		ID:        input.WorkspaceID,
		UpdatedAt: input.UpdatedAt,
	}
	return dbUpdateWorkspace(ctx, dbInput)
}
