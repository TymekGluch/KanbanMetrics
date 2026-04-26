package workspace

import "context"

func CreateWorkspace(ctx context.Context, input CreateWorkspaceInput) (*Workspace, error) {
	dbInput := dbInsertWorkspaceInput{
		Name:    input.Name,
		OwnerID: input.OwnerID,
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
