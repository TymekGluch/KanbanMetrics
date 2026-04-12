package router

import (
	"KanbanMetrics/internal/apiDocs"
	"KanbanMetrics/internal/appConfig"
	"KanbanMetrics/internal/auth"
	usersRouter "KanbanMetrics/internal/users/router"
	"KanbanMetrics/internal/validation"
	workspaceRouter "KanbanMetrics/internal/workspace/router"

	"github.com/gofiber/fiber/v3"
)

func InitializeRouter(router *fiber.App, validatorService *validation.Service, apiDocsService *apiDocs.Service) error {
	api := router.Group("/api")
	api.Use(appConfig.SetupCorsAndHeaders())

	apiDocs.RegisterRoutes(api, apiDocsService)

	api.Get("/hello", func(ctx fiber.Ctx) error {
		return ctx.SendString("Hello, World!")
	})

	auth.RegisterRoutes(api, validatorService)
	usersRouter.RegisterRoutes(api, validatorService)
	workspaceRouter.RegisterRoutes(api, validatorService)

	return nil
}
