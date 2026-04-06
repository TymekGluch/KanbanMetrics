package main

import (
	"KanbanMetrics/db"
	"KanbanMetrics/internal/appConfig"
	"KanbanMetrics/internal/router"
	"KanbanMetrics/internal/validation"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

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
