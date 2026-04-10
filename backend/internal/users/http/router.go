package users

import (
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/permission"
	"KanbanMetrics/internal/validation"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service) {
	route := app.Group("/user", auth.VerifyJwtTokenMiddleware())
	handlers := newHandlers(validatorService)

	authorizer := permission.NewRBACAuthorizer(permission.NewStaticRolePermissionResolver())
	permissionMiddleware := permission.NewMiddleware(authorizer)

	route.Delete("/delete", permissionMiddleware.Require(permission.UsersDeleteSelf), handlers.deleteUserHandler)
	route.Put("/update", permissionMiddleware.Require(permission.UsersUpdateSelf), handlers.updateUserHandler)
	route.Get("/me", permissionMiddleware.Require(permission.UsersReadSelf), handlers.meHandler)
}
