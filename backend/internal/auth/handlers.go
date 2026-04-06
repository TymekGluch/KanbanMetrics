package auth

import (
	"KanbanMetrics/internal/validation"

	"github.com/gofiber/fiber/v3"
)

type handlers struct {
	validatorService *validation.Service
}

func newHandlers(validatorService *validation.Service) *handlers {
	return &handlers{validatorService: validatorService}
}

func (handler *handlers) registerHandler(ctx fiber.Ctx) error {
	var input RegisterUserInput

	if err := ctx.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, ErrorInvalidBody)
	}

	if err := handler.validatorService.Struct(input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	token, err := RegisterUser(ctx.Context(), input)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	SetAuthCookie(ctx, token)

	return ctx.SendStatus(fiber.StatusCreated)
}

func (handler *handlers) loginHandler(ctx fiber.Ctx) error {
	var input LoginUserInput

	if err := ctx.Bind().Body(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, ErrorInvalidBody)
	}

	if err := handler.validatorService.Struct(input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	token, err := LoginUser(ctx.Context(), input)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, ErrorUnauthorized)
	}

	SetAuthCookie(ctx, token)

	return ctx.SendStatus(fiber.StatusOK)
}

func (handler *handlers) logoutHandler(ctx fiber.Ctx) error {
	RemoveAuthCookie(ctx)

	return ctx.SendStatus(fiber.StatusOK)
}
