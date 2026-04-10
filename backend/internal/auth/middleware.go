package auth

import (
	"KanbanMetrics/internal/users"

	"github.com/gofiber/fiber/v3"
)

func VerifyJwtTokenMiddleware() fiber.Handler {
	return func(ctx fiber.Ctx) error {
		tokenString := ctx.Cookies(CookieName)
		if tokenString == "" {
			return fiber.NewError(fiber.StatusUnauthorized, ErrorMissingToken)
		}

		isValid, err := verifyTokenHelper(tokenString)
		if err != nil || !isValid {
			return fiber.NewError(fiber.StatusUnauthorized, ErrorUnauthorized)
		}

		userID, err := GetUserIDFromToken(tokenString)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, ErrorUnauthorized)
		}

		userRole, err := users.GetUserRoleById(ctx.Context(), userID)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, ErrorUnauthorized)
		}

		ctx.Locals(ContextUserIDKey, userID)
		ctx.Locals(ContextUserRoleKey, userRole)

		return ctx.Next()
	}
}
