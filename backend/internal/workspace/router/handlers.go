package workspaceRouter

import (
	"KanbanMetrics/internal/appErrors"
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/permission"
	"KanbanMetrics/internal/users"
	"KanbanMetrics/internal/validation"
	"KanbanMetrics/internal/workspace"
	"strconv"

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

	if err := validation.BindJSONStrict(ctx, &input); err != nil {
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

// getWorkspaceByIdHandler godoc
// @Summary Get workspace by ID
// @Description Retrieves a workspace by its ID. User must have read access to the workspace.
// @Tags workspaces
// @Produce json
// @Security CookieAuth
// @Param id path string true "Workspace ID"
// @Success 200 {object} workspace.Workspace
// @Failure 400 {object} appErrors.AppError
// @Failure 401 {object} appErrors.AppError
// @Failure 403 {object} appErrors.AppError
// @Failure 404 {object} appErrors.AppError
// @Failure 408 {object} appErrors.AppError
// @Failure 500 {object} appErrors.AppError
// @Router /api/workspaces/{id} [get]
func (handler *handlers) getWorkspaceByIdHandler(ctx fiber.Ctx) error {
	workspaceID := ctx.Params(idParam)
	if workspaceID == "" {
		return fiber.NewError(fiber.StatusBadRequest, permission.ErrorMissingWorkspaceID)
	}

	foundWorkspace, err := workspace.GetWorkspaceByID(ctx.Context(), workspaceID)
	if err != nil {
		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	}

	return ctx.Status(fiber.StatusOK).JSON(foundWorkspace)
}

// listWorkspacesHandler godoc
// @Summary List workspaces
// @Description Returns a paginated list of workspaces available to the authenticated user (owner or member).
// @Tags workspaces
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param input body listWorkspacesRequest false "Workspace list filters"
// @Success 200 {object} workspace.ListWorkspacesResult
// @Failure 400 {object} appErrors.AppError
// @Failure 401 {object} appErrors.AppError
// @Failure 403 {object} appErrors.AppError
// @Failure 500 {object} appErrors.AppError
// @Router /api/workspaces [get]
func (handler *handlers) listWorkspacesHandler(ctx fiber.Ctx) error {
	var input listWorkspacesRequest

	limit := 100
	offset := 0

	if len(ctx.Request().Body()) > 0 {
		if err := validation.BindJSONStrict(ctx, &input); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, auth.ErrorInvalidBody)
		}
	}

	if rawLimit := ctx.Query("limit"); rawLimit != "" {
		parsedLimit, err := strconv.Atoi(rawLimit)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, auth.ErrorInvalidBody)
		}

		input.Limit = &parsedLimit
	}

	if rawOffset := ctx.Query("offset"); rawOffset != "" {
		parsedOffset, err := strconv.Atoi(rawOffset)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, auth.ErrorInvalidBody)
		}

		input.Offset = &parsedOffset
	}

	if rawOnlyMine := ctx.Query("only_mine"); rawOnlyMine != "" {
		parsedOnlyMine, err := strconv.ParseBool(rawOnlyMine)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, auth.ErrorInvalidBody)
		}

		input.OnlyMine = &parsedOnlyMine
	}

	if err := handler.validatorService.Struct(input); err != nil {
		return appErrors.Send(ctx, err)
	}

	if input.Limit != nil {
		limit = *input.Limit
	}

	if input.Offset != nil {
		offset = *input.Offset
	}

	userID, ok := ctx.Locals(auth.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		return fiber.NewError(fiber.StatusUnauthorized, auth.ErrorUnauthorized)
	}

	role, ok := ctx.Locals(auth.ContextUserRoleKey).(string)
	if !ok || role == "" {
		return fiber.NewError(fiber.StatusUnauthorized, auth.ErrorUnauthorized)
	}

	workspaceRole, ok := ctx.Locals(auth.ContextUserWorkspaceRoleKey).(string)
	if !ok {
		workspaceRole = ""
	}

	isAdmin := role == users.APP_ROLE_ADMIN

	var filterUserID *int64
	var filterOwnerID *int64
	if input.OnlyMine != nil && *input.OnlyMine == true {
		currentUserID := int64(userID)
		if workspaceRole == workspace.WORKSPACE_OWNER_ROLE {
			filterOwnerID = &currentUserID
		} else {
			filterUserID = &currentUserID
		}
	}

	result, err := workspace.GetWorkspaces(ctx.Context(), workspace.ListWorkspacesInput{
		IsAdmin:       isAdmin,
		FilterUserID:  filterUserID,
		FilterOwnerID: filterOwnerID,
		Limit:         limit,
		Offset:        offset,
	})
	if err != nil {
		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	}

	return ctx.Status(fiber.StatusOK).JSON(result)
}
