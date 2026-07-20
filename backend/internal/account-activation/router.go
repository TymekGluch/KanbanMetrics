package accountActivation

import (
	"KanbanMetrics/internal/permission"
	"KanbanMetrics/internal/validation"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service, mailClient *morphyxisMailClient.MailServiceClient) {
	route := app.Group("/account-activation-code")
	handlers := newHandlers(validatorService, mailClient)

	authorizer := permission.NewRBACAuthorizer(permission.NewStaticRolePermissionResolver())
	permissionMiddleware := permission.NewMiddleware(authorizer)

	route.Get("/get", permissionMiddleware.Require(permission.UsersReadSelf), handlers.getAccountActivationCodeHandler)
	route.Post("/activate", permissionMiddleware.Require(permission.UsersUpdateSelf), handlers.activateAccountHandler)
	route.Post("/generate", permissionMiddleware.Require(permission.UsersUpdateSelf), handlers.generateAccountActivationCodeHandler)
}
