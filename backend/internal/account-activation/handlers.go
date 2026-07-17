package accountActivation

import (
	"KanbanMetrics/internal/appErrors"
	globalContext "KanbanMetrics/internal/global-context"
	"KanbanMetrics/internal/users"
	"KanbanMetrics/internal/validation"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
)

type handlers struct {
	validatorService *validation.Service
	mailClient       *morphyxisMailClient.MailServiceClient
}

const (
	errorInvalidBody                  = "Invalid request body"
	errorUnauthorized                 = "Unauthorized"
	warnRetrievingUserAfterActivation = "Warning retrieving user after activation:"

	successAccountActivated = "KanbanMetrics: Account activated successfully"
)

func newHandlers(validatorService *validation.Service, mailClient *morphyxisMailClient.MailServiceClient) *handlers {
	return &handlers{
		validatorService: validatorService,
		mailClient:       mailClient,
	}
}

// getAccountActivationCodeHandler godoc
// @Summary Get account activation code
// @Description Retrieves the account activation code for the currently authenticated user.
// @Tags account-activation
// @Produce json
// @Security CookieAuth
// @Success 200 {object} AccountActivation
// @Failure 401 {string} string "Unauthorized"
// @Failure 500 {string} string "Internal server error"
// @Router /api/account-activation-code/get [get]
func (handler *handlers) getAccountActivationCodeHandler(ctx fiber.Ctx) error {
	userID, ok := ctx.Locals(globalContext.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		return fiber.NewError(fiber.StatusUnauthorized, errorUnauthorized)
	}

	if accountActivationCode, err := GetAccountActivationCodeByUserId(ctx, int(userID)); err != nil {
		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	} else {
		return ctx.Status(fiber.StatusOK).JSON(accountActivationCode)
	}
}

// activateAccountHandler godoc
// @Summary Activate user account
// @Description Activates the account for the currently authenticated user.
// @Tags account-activation
// @Produce json
// @Security CookieAuth
// @Param input body accountActivationInput true "Account activation payload"
// @Success 200 {object} accountActivationInput
// @Failure 401 {string} string "Unauthorized"
// @Failure 500 {string} string "Internal server error"
// @Router /api/account-activation-code/activate [post]
func (handler *handlers) activateAccountHandler(ctx fiber.Ctx) error {
	var input accountActivationInput

	userID, ok := ctx.Locals(globalContext.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		return fiber.NewError(fiber.StatusUnauthorized, errorUnauthorized)
	}

	if err := validation.BindJSONStrict(ctx, &input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errorInvalidBody)
	}

	if err := handler.validatorService.Struct(input); err != nil {
		return appErrors.Send(ctx, err)
	}

	var isActiveAndVerified = true

	if err := users.UpdateUser(ctx, users.UpdateUserInput{
		ID:         int(userID),
		IsActive:   &isActiveAndVerified,
		IsVerified: &isActiveAndVerified,
	}, false); err != nil {
		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	}

	user, err := users.GetUserById(ctx, int(userID))
	if err != nil {
		log.Warn(warnRetrievingUserAfterActivation, err)
	}

	(*handler.mailClient).SendAccountVerifiedEmail(ctx, morphyxisMailClient.SendAccountVerifiedEmailInput{
		To:      user.Email,
		Name:    user.Name,
		Subject: successAccountActivated,
	})

	return ctx.SendStatus(fiber.StatusOK)
}
