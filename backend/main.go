package main

import (
	"KanbanMetrics/db"
	"KanbanMetrics/internal/apiDocs"
	"KanbanMetrics/internal/appConfig"
	"KanbanMetrics/internal/router"
	"KanbanMetrics/internal/scheduler"
	"KanbanMetrics/internal/users"
	"KanbanMetrics/internal/validation"
	"context"
	"log"

	"github.com/gofiber/fiber/v3"
)

// @title KanbanMetrics API
// @version 1.0
// @description API for authentication and user management.
// @BasePath /api
// @schemes http https
// @securityDefinitions.apikey CookieAuth
// @in cookie
// @name auth_token

func main() {
	config := appConfig.Load()

	validatorService := validation.InitNewService()

	db.ConnectDb()
	app := fiber.New()

	ctx := context.Background()

	worker := scheduler.InitCallbackWorker()
	defer worker.Stop()

	users.ExpiredUnverifiedUsersCleanupService(ctx, worker)

	apiDocsService, err := apiDocs.NewService(config.AppURL)
	if err != nil {
		log.Fatal(err)
	}

	if err := router.InitializeRouter(app, validatorService, apiDocsService); err != nil {
		log.Fatal(err)
	}

	app.Listen(config.AppPort)
}
