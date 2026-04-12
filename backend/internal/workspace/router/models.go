package workspaceRouter

type createWorkspaceRequest struct {
	Name string `json:"name" validate:"required,min=3,max=400"`
}
