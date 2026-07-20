package usersRouter

import (
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/permission"
	"KanbanMetrics/internal/validation"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service, mailClient *morphyxisMailClient.MailServiceClient) {
	route := app.Group("/user", auth.VerifyJwtTokenMiddleware())
	handlers := newHandlers(validatorService, mailClient)

	authorizer := permission.NewRBACAuthorizer(permission.NewStaticRolePermissionResolver())
	permissionMiddleware := permission.NewMiddleware(authorizer)

	route.Delete("/delete", permissionMiddleware.Require(permission.UsersDeleteSelf), handlers.deleteUserHandler)
	route.Put("/update", permissionMiddleware.Require(permission.UsersUpdateSelf), handlers.updateUserHandler)
	route.Get("/me", permissionMiddleware.Require(permission.UsersReadSelf), handlers.meHandler)
}
