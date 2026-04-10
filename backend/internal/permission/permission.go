package permission

import (
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/users"
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
			users.RoleUser: {
				UsersReadSelf:   {},
				UsersUpdateSelf: {},
				UsersDeleteSelf: {},
			},
			users.RoleAdmin: {
				UsersReadSelf:   {},
				UsersUpdateSelf: {},
				UsersDeleteSelf: {},
				UsersReadAny:    {},
				UsersUpdateAny:  {},
				UsersDeleteAny:  {},
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
	userRole, ok := ctx.Locals(auth.ContextUserRoleKey).(string)
	if !ok || strings.TrimSpace(userRole) == "" {
		return "", fmt.Errorf("missing user role in request context")
	}

	return strings.ToLower(strings.TrimSpace(userRole)), nil
}
