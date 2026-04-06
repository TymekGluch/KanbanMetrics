package users

import (
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/validation"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service) {
	route := app.Group("/users", auth.VerifyJwtTokenMiddleware())
	handlers := newHandlers(validatorService)

	route.Delete("/delete", handlers.deleteUserHandler)
	route.Put("/update", handlers.updateUserHandler)
	route.Get("/me", handlers.meHandler)
}
