package authPermissions

import (
	globalContext "KanbanMetrics/internal/global-context"
	"KanbanMetrics/internal/users"

	"github.com/gofiber/fiber/v3"
)

func CheckIsUserVerifiedOrCancelRequestMiddleware() fiber.Handler {
	return func(ctx fiber.Ctx) error {
		userID, ok := ctx.Locals(globalContext.ContextUserIDKey).(uint)
		if !ok || userID == 0 {
			return fiber.NewError(fiber.StatusUnauthorized, authPermissionsErrorUnauthorized)
		}

		user, err := users.GetUserById(ctx, int(userID))
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, authPermissionsErrorUserNotVerified)
		}

		if user.IsVerified == nil || !*user.IsVerified {
			return fiber.NewError(fiber.StatusUnauthorized, authPermissionsErrorUserNotVerified)
		}

		return ctx.Next()
	}
}
