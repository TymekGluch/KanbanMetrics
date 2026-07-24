package auth

import (
	turnstileIntegration "KanbanMetrics/internal/turnstile-integration"
	"KanbanMetrics/internal/validation"
	"os"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
	"github.com/gofiber/fiber/v3"
)

func RegisterRoutes(app fiber.Router, validatorService *validation.Service, mailClient *morphyxisMailClient.MailServiceClient) {
	authRoute := app.Group("/auth")
	handlers := newHandlers(validatorService, mailClient)

	turnstileClient := turnstileIntegration.New(os.Getenv("CLOUDFLARE_TURNSTILE_API_KEY"))

	authRoute.Post("/register", turnstileClient.VerifyMiddleware, handlers.registerHandler)
	authRoute.Post("/login", turnstileClient.VerifyMiddleware, handlers.loginHandler)
	authRoute.Post("/logout", handlers.logoutHandler)
}
