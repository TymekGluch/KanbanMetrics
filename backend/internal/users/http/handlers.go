package users

import (
	"KanbanMetrics/internal/appErrors"
	"KanbanMetrics/internal/auth"
	"KanbanMetrics/internal/users"
	"KanbanMetrics/internal/validation"

	"github.com/gofiber/fiber/v3"
)

type handlers struct {
	validatorService *validation.Service
}

func newHandlers(validatorService *validation.Service) *handlers {
	return &handlers{validatorService: validatorService}
}

// deleteUserHandler godoc
// @Summary Delete current user
// @Description Deletes the currently authenticated user and removes auth cookie.
// @Tags user
// @Produce plain
// @Security CookieAuth
// @Success 200 {string} string "OK"
// @Failure 401 {string} string "Unauthorized"
// @Failure 500 {string} string "Internal server error"
// @Router /api/user/delete [delete]
func (handler *handlers) deleteUserHandler(ctx fiber.Ctx) error {
	userID, ok := ctx.Locals(auth.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		return fiber.NewError(fiber.StatusUnauthorized, auth.ErrorUnauthorized)
	}

	if err := users.DeleteUser(ctx, int(userID)); err != nil {
		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	}

	auth.RemoveAuthCookie(ctx)

	return ctx.SendStatus(fiber.StatusOK)
}

// updateUserHandler godoc
// @Summary Update current user
// @Description Updates selected fields for the currently authenticated user.
// @Tags user
// @Accept json
// @Produce plain
// @Security CookieAuth
// @Param input body users.UpdateUserHandlerInput true "Update payload"
// @Success 200 {string} string "OK"
// @Failure 400 {string} string "Invalid request"
// @Failure 401 {string} string "Unauthorized"
// @Failure 500 {string} string "Internal server error"
// @Router /api/user/update [put]
func (handler *handlers) updateUserHandler(ctx fiber.Ctx) error {
	var input users.UpdateUserHandlerInput

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

	payload := users.UpdateUserInput{
		ID:          int(userID),
		Name:        input.Name,
		Email:       input.Email,
		Password:    input.Password,
		Role:        input.Role,
		IsActive:    input.IsActive,
		IsVerified:  input.IsVerified,
		LastLoginAt: input.LastLoginAt,
	}

	if err := users.UpdateUser(ctx, payload, true); err != nil {
		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	}

	return ctx.SendStatus(fiber.StatusOK)
}

// meHandler godoc
// @Summary Get current user
// @Description Returns profile of the currently authenticated user.
// @Tags user
// @Produce json
// @Security CookieAuth
// @Success 200 {object} users.User
// @Failure 401 {string} string "Unauthorized"
// @Failure 500 {string} string "Internal server error"
// @Router /api/user/me [get]
func (handler *handlers) meHandler(ctx fiber.Ctx) error {
	userID, ok := ctx.Locals(auth.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		return fiber.NewError(fiber.StatusUnauthorized, auth.ErrorUnauthorized)
	}

	if user, err := users.GetUserById(ctx, int(userID)); err != nil {
		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	} else {
		return ctx.Status(fiber.StatusOK).JSON(user)
	}
}
