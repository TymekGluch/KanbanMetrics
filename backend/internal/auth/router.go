package auth

import (
	"KanbanMetrics/internal/validation"

	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service) {
	authRoute := app.Group("/auth")
	handlers := newHandlers(validatorService)

	authRoute.Post("/register", handlers.registerHandler)
	authRoute.Post("/login", handlers.loginHandler)
	authRoute.Post("/logout", handlers.logoutHandler)
}
