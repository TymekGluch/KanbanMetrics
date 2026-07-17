package auth

import (
	accountActivation "KanbanMetrics/internal/account-activation"
	"KanbanMetrics/internal/appErrors"
	"KanbanMetrics/internal/users"
	"KanbanMetrics/internal/validation"
	"log"
	"time"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
	"github.com/gofiber/fiber/v3"
)

type Handlers struct {
	validatorService *validation.Service
	mailClient       *morphyxisMailClient.MailServiceClient
}

func newHandlers(validatorService *validation.Service, mailClient *morphyxisMailClient.MailServiceClient) *Handlers {
	return &Handlers{validatorService: validatorService, mailClient: mailClient}
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
func (handler *Handlers) registerHandler(ctx fiber.Ctx) error {
	var input RegisterUserInput

	if err := validation.BindJSONStrict(ctx, &input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, ErrorInvalidBody)
	}

	if err := handler.validatorService.Struct(input); err != nil {
		return appErrors.Send(ctx, err)
	}

	userID, token, err := RegisterUser(ctx.Context(), input)
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

	verificationCode, err := accountActivation.GenerateAccountActivationCode(ctx.Context(), userID)
	if err != nil {
		log.Println("Error generating activation code:", err)
	}

	if err := (*handler.mailClient).SendAccountConfirmationEmail(ctx, morphyxisMailClient.SendAccountConfirmationEmailInput{
		To:                  input.Email,
		Name:                input.Name,
		Subject:             "KanbanMetrics: Your account was created, please confirm it",
		VerificationCode:    verificationCode,
		AccountDeletionDate: time.Now().AddDate(0, 0, users.DefaultDeletionAfterDays),
	}); err != nil {
		log.Println("Error during sending account confirmation email:", err)
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
func (handler *Handlers) loginHandler(ctx fiber.Ctx) error {
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
func (handler *Handlers) logoutHandler(ctx fiber.Ctx) error {
	RemoveAuthCookie(ctx)

	return ctx.SendStatus(fiber.StatusOK)
}
