package workspaceRouter

type createWorkspaceRequest struct {
	Name string `json:"name" validate:"required,min=3,max=400"`
}

type listWorkspacesRequest struct {
	Limit    *int  `json:"limit,omitempty" validate:"omitempty,min=1,max=100"`
	Offset   *int  `json:"offset,omitempty" validate:"omitempty,min=0"`
	OnlyMine *bool `json:"only_mine,omitempty"`
}
