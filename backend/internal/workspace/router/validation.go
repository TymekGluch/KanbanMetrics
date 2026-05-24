package workspaceRouter

import (
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

const (
	ErrorMissingWorkspaceID = "Missing workspace ID"
	ErrorInvalidWorkspaceID = "Invalid workspace ID"
)

func parseAndValidateWorkspaceID(ctx fiber.Ctx, workspaceIDParam string) (string, error) {
	workspaceID := ctx.Params(workspaceIDParam)
	if workspaceID == "" {
		return "", fiber.NewError(fiber.StatusBadRequest, ErrorMissingWorkspaceID)
	}

	if _, err := uuid.Parse(workspaceID); err != nil {
		return "", fiber.NewError(fiber.StatusBadRequest, ErrorInvalidWorkspaceID)
	}

	return workspaceID, nil
}
