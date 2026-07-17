package auth

import (
	"KanbanMetrics/internal/validation"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service, mailClient *morphyxisMailClient.MailServiceClient) {
	authRoute := app.Group("/auth")
	handlers := newHandlers(validatorService, mailClient)

	authRoute.Post("/register", handlers.registerHandler)
	authRoute.Post("/login", handlers.loginHandler)
	authRoute.Post("/logout", handlers.logoutHandler)
}
