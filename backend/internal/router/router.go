package router

import (
	accountActivation "KanbanMetrics/internal/account-activation"
	"KanbanMetrics/internal/apiDocs"
	"KanbanMetrics/internal/appConfig"
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/requests"
	usersRouter "KanbanMetrics/internal/users/router"
	"KanbanMetrics/internal/validation"
	workspaceRouter "KanbanMetrics/internal/workspace/router"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"

	"github.com/gofiber/fiber/v3"
)

func InitializeRouter(router *fiber.App, validatorService *validation.Service, apiDocsService *apiDocs.Service, mailClient *morphyxisMailClient.MailServiceClient) error {
	api := router.Group("/api")
	api.Use(appConfig.SetupCorsAndHeaders())
	api.Use(requests.TimeoutMiddleware(requests.TimeoutConfig{}))

	apiDocs.RegisterRoutes(api, apiDocsService)

	api.Get("/hello", func(ctx fiber.Ctx) error {
		return ctx.SendString("Hello, World!")
	})

	auth.RegisterRoutes(api, validatorService, mailClient)
	usersRouter.RegisterRoutes(api, validatorService, mailClient)
	workspaceRouter.RegisterRoutes(api, validatorService)
	accountActivation.RegisterRoutes(api.Group("", auth.VerifyJwtTokenMiddleware()), validatorService, mailClient)

	return nil
}
