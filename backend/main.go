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
	"os"
	"time"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"

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

	morphyxisMailClient, err := morphyxisMailClient.New(morphyxisMailClient.Config{
		BaseURL: os.Getenv("MAIL_SERVICE_DOMAIN"),
		Timeout: 10 * time.Second,
	})
	if err != nil {
		log.Fatal(err)
	}

	worker := scheduler.InitCallbackWorker()
	defer worker.Stop()

	users.ExpiredUnverifiedUsersCleanupService(ctx, worker, &morphyxisMailClient)

	apiDocsService, err := apiDocs.NewService(config.AppURL)
	if err != nil {
		log.Fatal(err)
	}

	if err := router.InitializeRouter(app, validatorService, apiDocsService); err != nil {
		log.Fatal(err)
	}

	app.Listen(config.AppPort)
}
