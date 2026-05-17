package workspace

import "time"

type dbInsertWorkspaceInput struct {
	Name        string
	Description *string
	OwnerID     int64
}

type Workspace struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Description *string    `json:"description,omitempty"`
	OwnerID     int64      `json:"owner_id"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at,omitempty"`
}

type CreateWorkspaceInput struct {
	Name        string  `json:"name" validate:"required,min=3,max=400"`
	Description *string `json:"description,omitempty" validate:"max=1000"`
	OwnerID     int64   `json:"owner_id" validate:"required"`
}

type ListWorkspacesInput struct {
	IsAdmin       bool   `json:"is_admin"`
	FilterUserID  *int64 `json:"user_id,omitempty"`
	FilterOwnerID *int64 `json:"owner_id,omitempty"`
	Limit         int    `json:"limit" validate:"required,min=1,max=100"`
	Offset        int    `json:"offset" validate:"min=0"`
}

type ListWorkspacesResult struct {
	Items  []Workspace `json:"items"`
	Limit  int         `json:"limit"`
	Offset int         `json:"offset"`
}

type dbSelectMultipleWorkspacesInput struct {
	IsAdmin       bool
	FilterUserID  *int64
	FilterOwnerID *int64
	Limit         int
	Offset        int
}

type dbDropWorkspaceInput struct {
	ID string `json:"ID" validate:"required"`
}
