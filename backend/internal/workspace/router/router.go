package workspaceRouter

import (
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/permission"
	"KanbanMetrics/internal/validation"

	"github.com/gofiber/fiber/v3"
)

const (
	idParam = "id"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service) {
	route := app.Group("/workspaces", auth.VerifyJwtTokenMiddleware())
	handlers := newHandlers(validatorService)

	authorizer := permission.NewRBACAuthorizer(permission.NewStaticRolePermissionResolver())
	permissionMiddleware := permission.NewMiddleware(authorizer)

	route.Get("/", permissionMiddleware.RequireAny(permission.WorkspaceCreate, permission.WorkspaceRead), handlers.listWorkspacesHandler)
	route.Post("/create", permissionMiddleware.Require(permission.WorkspaceCreate), handlers.createWorkspaceHandler)
	route.Get("/:id", permissionMiddleware.LoadWorkspaceRoleOrGlobal(permission.WorkspaceRead, idParam), permissionMiddleware.RequireWorkspace(permission.WorkspaceRead), handlers.getWorkspaceByIdHandler)
}
