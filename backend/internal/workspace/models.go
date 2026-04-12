package workspace

import "time"

type dbInsertWorkspaceInput struct {
	Name    string
	OwnerID int64
}

type Workspace struct {
	ID        string     `json:"id"`
	Name      string     `json:"name"`
	OwnerID   int64      `json:"owner_id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

type CreateWorkspaceInput struct {
	Name    string `json:"name" validate:"required,min=3,max=400"`
	OwnerID int64  `json:"owner_id" validate:"required"`
}
