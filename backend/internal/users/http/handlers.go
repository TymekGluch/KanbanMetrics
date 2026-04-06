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
