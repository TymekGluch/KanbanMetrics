package permission

import (
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/workspace"

	"github.com/gofiber/fiber/v3"
)

const (
	ErrorForbidden = "Forbidden"
)

type Middleware struct {
	authorizer Authorizer
}

func NewMiddleware(authorizer Authorizer) *Middleware {
	return &Middleware{authorizer: authorizer}
}

func (middleware *Middleware) Require(permission Permission) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		role, err := ContextUserRole(ctx)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		}

		if !middleware.authorizer.HasPermission(role, permission) {
			return fiber.NewError(fiber.StatusForbidden, ErrorForbidden)
		}

		return ctx.Next()
	}
}

func (middleware *Middleware) RequireAny(permissions ...Permission) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		role, err := ContextUserRole(ctx)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		}

		for _, permission := range permissions {
			if middleware.authorizer.HasPermission(role, permission) {
				return ctx.Next()
			}
		}

		return fiber.NewError(fiber.StatusForbidden, ErrorForbidden)
	}
}

func (middleware *Middleware) LoadWorkspaceRole(workspaceIDParam string) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		userID, ok := ctx.Locals(auth.ContextUserIDKey).(uint)
		if !ok || userID == 0 {
			return fiber.NewError(fiber.StatusUnauthorized, auth.ErrorUnauthorized)
		}

		workspaceID := ctx.Params(workspaceIDParam)
		if workspaceID == "" {
			return fiber.NewError(fiber.StatusBadRequest, "missing workspace id")
		}

		workspaceRole, err := workspace.GetUserWorkspaceRole(ctx.Context(), userID, workspaceID)
		if err != nil {
			return fiber.NewError(fiber.StatusForbidden, ErrorForbidden)
		}

		ctx.Locals(auth.ContextUserWorkspaceRoleKey, workspaceRole)

		return ctx.Next()
	}
}

func (middleware *Middleware) RequireWorkspace(permission Permission) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		role, err := ContextUserWorkspaceRole(ctx)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		}

		if !middleware.authorizer.HasPermission(role, permission) {
			return fiber.NewError(fiber.StatusForbidden, ErrorForbidden)
		}

		return ctx.Next()
	}
}

func (middleware *Middleware) RequireAnyWorkspace(permissions ...Permission) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		role, err := ContextUserWorkspaceRole(ctx)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		}

		for _, permission := range permissions {
			if middleware.authorizer.HasPermission(role, permission) {
				return ctx.Next()
			}
		}

		return fiber.NewError(fiber.StatusForbidden, ErrorForbidden)
	}
}
