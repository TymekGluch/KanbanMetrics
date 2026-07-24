package accountActivation

import (
	"KanbanMetrics/internal/permission"
	turnstileIntegration "KanbanMetrics/internal/turnstile-integration"
	"KanbanMetrics/internal/validation"
	"os"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service, mailClient *morphyxisMailClient.MailServiceClient) {
	route := app.Group("/account-activation-code")
	handlers := newHandlers(validatorService, mailClient)

	authorizer := permission.NewRBACAuthorizer(permission.NewStaticRolePermissionResolver())
	permissionMiddleware := permission.NewMiddleware(authorizer)

	turnstileClient := turnstileIntegration.New(os.Getenv("CLOUDFLARE_TURNSTILE_API_KEY"))

	route.Get("/get", permissionMiddleware.Require(permission.UsersReadSelf), handlers.getAccountActivationCodeHandler)
	route.Post("/activate", permissionMiddleware.Require(permission.UsersUpdateSelf), turnstileClient.VerifyMiddleware, handlers.activateAccountHandler)
	route.Post("/generate", permissionMiddleware.Require(permission.UsersUpdateSelf), turnstileClient.VerifyMiddleware, handlers.generateAccountActivationCodeHandler)
}
