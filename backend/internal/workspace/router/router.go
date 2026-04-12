package workspaceRouter

import (
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/permission"
	"KanbanMetrics/internal/validation"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service) {
	route := app.Group("/workspaces", auth.VerifyJwtTokenMiddleware())
	handlers := newHandlers(validatorService)

	authorizer := permission.NewRBACAuthorizer(permission.NewStaticRolePermissionResolver())
	permissionMiddleware := permission.NewMiddleware(authorizer)

	route.Post("/create", permissionMiddleware.Require(permission.WorkspaceCreate), handlers.createWorkspaceHandler)
}
