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
