package permission

import (
	globalContext "KanbanMetrics/internal/global-context"
	"KanbanMetrics/internal/workspace"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v3"
)

type Permission string

const (
	UsersReadSelf   Permission = "users.read.self"
	UsersUpdateSelf Permission = "users.update.self"
	UsersDeleteSelf Permission = "users.delete.self"

	UsersReadAny   Permission = "users.read.any"
	UsersUpdateAny Permission = "users.update.any"
	UsersDeleteAny Permission = "users.delete.any"

	WorkspaceRead   Permission = "workspace.read"
	WorkspaceUpdate Permission = "workspace.update"
	WorkspaceDelete Permission = "workspace.delete"
	WorkspaceCreate Permission = "workspace.create"
)

type RolePermissionResolver interface {
	PermissionsForRole(role string) map[Permission]struct{}
}

type Authorizer interface {
	HasPermission(role string, permission Permission) bool
}

type StaticRolePermissionResolver struct {
	permissionsByRole map[string]map[Permission]struct{}
}

func NewStaticRolePermissionResolver() *StaticRolePermissionResolver {
	return &StaticRolePermissionResolver{
		permissionsByRole: map[string]map[Permission]struct{}{
			globalContext.APP_ROLE_USER: {
				UsersReadSelf:   {},
				UsersUpdateSelf: {},
				UsersDeleteSelf: {},
				WorkspaceCreate: {},
			},
			globalContext.APP_ROLE_ADMIN: {
				UsersReadSelf:   {},
				UsersUpdateSelf: {},
				UsersDeleteSelf: {},
				UsersReadAny:    {},
				UsersUpdateAny:  {},
				UsersDeleteAny:  {},
				WorkspaceCreate: {},
				WorkspaceRead:   {},
				WorkspaceDelete: {},
			},
			workspace.WORKSPACE_VIEWER_ROLE: {
				WorkspaceRead: {},
			},
			workspace.WORKSPACE_ADMIN_ROLE: {
				WorkspaceRead:   {},
				WorkspaceUpdate: {},
			},
			workspace.WORKSPACE_OWNER_ROLE: {
				WorkspaceRead:   {},
				WorkspaceUpdate: {},
				WorkspaceDelete: {},
				WorkspaceCreate: {},
			},
		},
	}
}

func (resolver *StaticRolePermissionResolver) PermissionsForRole(role string) map[Permission]struct{} {
	normalizedRole := strings.TrimSpace(strings.ToLower(role))
	if normalizedRole == "" {
		return map[Permission]struct{}{}
	}

	permissions, exists := resolver.permissionsByRole[normalizedRole]
	if !exists {
		return map[Permission]struct{}{}
	}

	return permissions
}

type RBACAuthorizer struct {
	resolver RolePermissionResolver
}

func NewRBACAuthorizer(resolver RolePermissionResolver) *RBACAuthorizer {
	return &RBACAuthorizer{resolver: resolver}
}

func (authorizer *RBACAuthorizer) HasPermission(role string, permission Permission) bool {
	permissions := authorizer.resolver.PermissionsForRole(role)
	_, exists := permissions[permission]

	return exists
}

func ContextUserRole(ctx fiber.Ctx) (string, error) {
	userRole, ok := ctx.Locals(globalContext.ContextUserRoleKey).(string)
	if !ok || strings.TrimSpace(userRole) == "" {
		return "", fmt.Errorf("missing user role in request context")
	}

	return strings.ToLower(strings.TrimSpace(userRole)), nil
}

func ContextUserWorkspaceRole(ctx fiber.Ctx) (string, error) {
	workspaceRole, ok := ctx.Locals(globalContext.ContextUserWorkspaceRoleKey).(string)
	if !ok || strings.TrimSpace(workspaceRole) == "" {
		return "", fmt.Errorf("missing workspace role in request context")
	}

	return strings.ToLower(strings.TrimSpace(workspaceRole)), nil
}

func ContextWorkspaceID(ctx fiber.Ctx) (string, error) {
	workspaceID, ok := ctx.Locals(globalContext.ContextWorkspaceIDKey).(string)
	if !ok || strings.TrimSpace(workspaceID) == "" {
		return "", fmt.Errorf("missing workspace id in request context")
	}

	return strings.TrimSpace(workspaceID), nil
}
