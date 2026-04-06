package users

import (
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
// @Tags users
// @Produce plain
// @Security CookieAuth
// @Success 200 {string} string "OK"
// @Failure 401 {string} string "Unauthorized"
// @Failure 500 {string} string "Internal server error"
// @Router /users/delete [delete]
func (handler *handlers) deleteUserHandler(ctx fiber.Ctx) error {
	userID, ok := ctx.Locals(auth.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		return fiber.NewError(fiber.StatusUnauthorized, auth.ErrorUnauthorized)
	}

	if err := users.DeleteUser(ctx, int(userID)); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, auth.ErrorInternalDBError)
	}

	auth.RemoveAuthCookie(ctx)

	return ctx.SendStatus(fiber.StatusOK)
}

// updateUserHandler godoc
// @Summary Update current user
// @Description Updates selected fields for the currently authenticated user.
// @Tags users
// @Accept json
// @Produce plain
// @Security CookieAuth
// @Param input body users.UpdateUserHandlerInput true "Update payload"
// @Success 200 {string} string "OK"
// @Failure 400 {string} string "Invalid request"
// @Failure 401 {string} string "Unauthorized"
// @Failure 500 {string} string "Internal server error"
// @Router /users/update [put]
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
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
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
		return fiber.NewError(fiber.StatusInternalServerError, auth.ErrorInternalDBError)
	}

	return ctx.SendStatus(fiber.StatusOK)
}

// meHandler godoc
// @Summary Get current user
// @Description Returns profile of the currently authenticated user.
// @Tags users
// @Produce json
// @Security CookieAuth
// @Success 200 {object} users.User
// @Failure 401 {string} string "Unauthorized"
// @Failure 500 {string} string "Internal server error"
// @Router /users/me [get]
func (handler *handlers) meHandler(ctx fiber.Ctx) error {
	userID, ok := ctx.Locals(auth.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		return fiber.NewError(fiber.StatusUnauthorized, auth.ErrorUnauthorized)
	}

	if user, err := users.GetUserById(ctx, int(userID)); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, auth.ErrorInternalDBError)
	} else {
		return ctx.Status(fiber.StatusOK).JSON(user)
	}
}
