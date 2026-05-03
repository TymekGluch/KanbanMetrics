package auth

import (
	"KanbanMetrics/internal/appErrors"
	"KanbanMetrics/internal/validation"

	"github.com/gofiber/fiber/v3"
)

type handlers struct {
	validatorService *validation.Service
}

func newHandlers(validatorService *validation.Service) *handlers {
	return &handlers{validatorService: validatorService}
}

// registerHandler godoc
// @Summary Register user
// @Description Creates a user account and sets auth cookie.
// @Tags auth
// @Accept json
// @Produce plain
// @Param input body RegisterUserInput true "Register payload"
// @Success 201 {string} string "Created"
// @Failure 400 {string} string "Invalid request"
// @Failure 409 {object} appErrors.ValidationErrorResponse "Conflict"
// @Failure 500 {string} string "Internal server error"
// @Router /api/auth/register [post]
func (handler *handlers) registerHandler(ctx fiber.Ctx) error {
	var input RegisterUserInput

	if err := validation.BindJSONStrict(ctx, &input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, ErrorInvalidBody)
	}

	if err := handler.validatorService.Struct(input); err != nil {
		return appErrors.Send(ctx, err)
	}

	token, err := RegisterUser(ctx.Context(), input)
	if err != nil {
		mappedErr := appErrors.TranslatePostgresDbError(err)

		if mappedErr.Status() == fiber.StatusConflict && mappedErr.Error() == appErrors.ErrEmailAlreadyInUse {
			return ctx.Status(fiber.StatusConflict).JSON(appErrors.ValidationErrorResponse{
				Message: appErrors.ErrConflict,
				Fields: []appErrors.FieldError{
					{Field: "email", Message: appErrors.ErrEmailAlreadyInUse},
				},
			})
		}

		return mappedErr.FiberNewError()
	}

	SetAuthCookie(ctx, token)

	return ctx.SendStatus(fiber.StatusCreated)
}

// loginHandler godoc
// @Summary Login user
// @Description Authenticates user and sets auth cookie.
// @Tags auth
// @Accept json
// @Produce plain
// @Param input body LoginUserInput true "Login payload"
// @Success 200 {string} string "OK"
// @Failure 400 {string} string "Invalid request"
// @Failure 401 {object} appErrors.ValidationErrorResponse "Unauthorized"
// @Router /api/auth/login [post]
func (handler *handlers) loginHandler(ctx fiber.Ctx) error {
	var input LoginUserInput

	if err := validation.BindJSONStrict(ctx, &input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, ErrorInvalidBody)
	}

	if err := handler.validatorService.Struct(input); err != nil {
		return appErrors.Send(ctx, err)
	}

	token, err := LoginUser(ctx.Context(), input)
	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(appErrors.ValidationErrorResponse{
			Message: ErrorUnauthorized,
			Fields: []appErrors.FieldError{
				{Field: "global", Message: ErrorInvalidCredentials},
			},
		})
	}

	SetAuthCookie(ctx, token)

	return ctx.SendStatus(fiber.StatusOK)
}

// logoutHandler godoc
// @Summary Logout user
// @Description Removes auth cookie.
// @Tags auth
// @Produce plain
// @Success 200 {string} string "OK"
// @Router /api/auth/logout [post]
func (handler *handlers) logoutHandler(ctx fiber.Ctx) error {
	RemoveAuthCookie(ctx)

	return ctx.SendStatus(fiber.StatusOK)
}
