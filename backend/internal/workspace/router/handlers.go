package workspaceRouter

import (
	"KanbanMetrics/internal/appErrors"
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/validation"
	"KanbanMetrics/internal/workspace"

	"github.com/gofiber/fiber/v3"
)

type handlers struct {
	validatorService *validation.Service
}

func newHandlers(validatorService *validation.Service) *handlers {
	return &handlers{validatorService: validatorService}
}

// createWorkspaceHandler godoc
// @Summary Create a new workspace
// @Description Creates a new workspace with the authenticated user as the owner.
// @Tags workspaces
// @Accept json
// @Produce json
// @Param input body createWorkspaceRequest true "Workspace input"
// @Success 201 {object} workspace.Workspace
// @Failure 400 {object} appErrors.AppError
// @Failure 401 {object} appErrors.AppError
// @Failure 500 {object} appErrors.AppError
// @Router /api/workspaces/create [post]
func (handler *handlers) createWorkspaceHandler(ctx fiber.Ctx) error {
	var input createWorkspaceRequest

	userID, ok := ctx.Locals(auth.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		return fiber.NewError(fiber.StatusUnauthorized, auth.ErrorUnauthorized)
	}

	if err := ctx.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, auth.ErrorInvalidBody)
	}

	if err := handler.validatorService.Struct(input); err != nil {
		return appErrors.Send(ctx, err)
	}

	newWorkspace, err := workspace.CreateWorkspace(ctx.Context(), workspace.CreateWorkspaceInput{
		Name:    input.Name,
		OwnerID: int64(userID),
	})
	if err != nil {
		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	}

	return ctx.Status(fiber.StatusCreated).JSON(newWorkspace)
}
