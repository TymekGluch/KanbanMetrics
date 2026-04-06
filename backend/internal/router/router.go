package router

import (
	"os"
	"strings"

	"KanbanMetrics/docs"
	"KanbanMetrics/internal/appConfig"
	"KanbanMetrics/internal/auth"
	usersRoutes "KanbanMetrics/internal/users/http"
	"KanbanMetrics/internal/validation"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/adaptor"
	httpSwagger "github.com/swaggo/http-swagger"
)

func InitializeRouter(router *fiber.App, validatorService *validation.Service) error {
	appURL := os.Getenv("APP_URL")
	appURL = strings.TrimPrefix(appURL, "https://")
	appURL = strings.TrimPrefix(appURL, "http://")
	if appURL != "" {
		docs.SwaggerInfo.Host = appURL
	}

	api := router.Group("/api")
	api.Use(appConfig.SetupCorsAndHeaders())

	api.Get("/swagger/*", adaptor.HTTPHandler(httpSwagger.Handler(
		httpSwagger.URL("/api/swagger/doc.json"),
	)))

	api.Get("/hello", func(ctx fiber.Ctx) error {
		return ctx.SendString("Hello, World!")
	})

	auth.RegisterRoutes(api, validatorService)
	usersRoutes.RegisterRoutes(api, validatorService)

	return nil
}
