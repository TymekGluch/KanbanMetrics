package auth

const (
	ErrorUnauthorized       = "Unauthorized"
	ErrorInvalidCredentials = "Invalid email or password"
	ErrorMissingToken       = "Missing or invalid token"
	ErrorInvalidBody        = "Invalid request body"
	ErrorInternalDBError    = "Something went wrong, please try again later"

	CookieName            = "auth_token"
	ContextUserIDKey      = "user_id"
	ContextUserRoleKey    = "user_role"
	ContextWorkspaceIDKey = "workspace_id"

	ContextUserWorkspaceRoleKey = "user_workspace_role"
)
