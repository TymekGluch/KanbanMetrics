package workspaceRouter

import (
	"github.com/gofiber/fiber/v3"
)

func ValidateWorkspaceIDParam(workspaceIDParam string) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		if _, err := parseAndValidateWorkspaceID(ctx, workspaceIDParam); err != nil {
			return err
		}

		return ctx.Next()
	}
}
