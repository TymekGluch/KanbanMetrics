package main

import (
	"KanbanMetrics/db"
	"KanbanMetrics/internal/appConfig"
	"KanbanMetrics/internal/router"
	"KanbanMetrics/internal/validation"

	"github.com/go-playground/validator/v10"
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

	validatorInstance := validator.New()
	validation.RegisterCustomValidations(validatorInstance)
	validatorService := validation.NewService(validatorInstance)

	db.ConnectDb()
	app := fiber.New()

	router.InitializeRouter(app, validatorService)

	app.Listen(config.AppPort)
}
