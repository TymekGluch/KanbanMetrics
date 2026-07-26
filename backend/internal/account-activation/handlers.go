package accountActivation

import (
	"KanbanMetrics/internal/appErrors"
	globalContext "KanbanMetrics/internal/global-context"
	rateLimiting "KanbanMetrics/internal/rate-limiting"
	"KanbanMetrics/internal/users"
	"KanbanMetrics/internal/validation"
	"strconv"
	"time"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
)

const (
	notFoundActivationCodeError = "Account activation code not found for the user"
	activationCodeExpiredError  = "Activation code has expired or never existed for the user, please generate a new one"
)

type handlers struct {
	validatorService *validation.Service
	mailClient       *morphyxisMailClient.MailServiceClient
}

const (
	errorInvalidBody     = "Invalid request body"
	errorUnauthorized    = "Unauthorized"
	errorCodeAlreadyUsed = "Activation code has already been used"

	warnRetrievingUserAfterActivation = "Warning retrieving user after activation:"
	warnSendingAccountVerifiedEmail   = "Warning sending account verified email:"

	successAccountActivated      = "KanbanMetrics: Account activated successfully"
	subjectAccountActivationCode = "KanbanMetrics: New account activation code"
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
// @Failure 404 {string} string activationCodeExpiredError
// @Failure 500 {string} string "Internal server error"
// @Router /api/account-activation-code/get [get]
func (handler *handlers) getAccountActivationCodeHandler(ctx fiber.Ctx) error {
	userID, ok := ctx.Locals(globalContext.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		log.Warnf("Unauthorized access attempt to get account activation code")

		return fiber.NewError(fiber.StatusUnauthorized, errorUnauthorized)
	}

	if accountActivationCode, err := GetAccountActivationCodeByUserId(ctx, int(userID)); err != nil {
		if appErrors.TranslatePostgresDbError(err).FiberNewError().Message == appErrors.ErrNotFound {
			log.Warnf("Account activation code not found for user %d", userID)

			return fiber.NewError(fiber.StatusNotFound, activationCodeExpiredError)
		}

		log.Warnf("DATABASE: Error retrieving account activation code for user %d: %v", userID, err)

		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	} else {
		log.Infof("Successfully retrieved account activation code for user %d", userID)

		return ctx.Status(fiber.StatusOK).JSON(accountActivationCode)
	}
}

// generateAccountActivationCodeHandler godoc
// @Summary Generate account activation code
// @Description Generates a new account activation code for the currently authenticated user.
// @Tags account-activation
// @Produce json
// @Security CookieAuth
// @Success 200 {object} ActivationCodeOutput
// @Failure 401 {string} string "Unauthorized"
// @Failure 429 {string} string "Too many requests"
// @Failure 500 {string} string "Internal server error"
// @Router /api/account-activation-code/generate [post]
func (handler *handlers) generateAccountActivationCodeHandler(ctx fiber.Ctx) error {
	userID, ok := ctx.Locals(globalContext.ContextUserIDKey).(uint)
	if !ok || userID == 0 {
		return fiber.NewError(fiber.StatusUnauthorized, errorUnauthorized)
	}

	userIdentityStr := strconv.Itoa(int(userID))

	rateLimiting := rateLimiting.Init(rateLimiting.RateLimitConfig{
		Ctx:          ctx.Context(),
		UserIp:       ctx.IP(),
		UserIdentity: &userIdentityStr,
		EndpointName: "api-account-activation-code-generate",
	})

	if !rateLimiting.ShouldAllowRequest() {
		return ctx.Status(fiber.StatusTooManyRequests).SendString("Too many requests. Please try again later.")
	}

	user, err := users.GetUserById(ctx, int(userID))
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	verificationCode, expirationAt, err := GenerateAccountActivationCode(ctx, int(userID))
	if err != nil {
		log.Warnf("Error generating activation code: %v", err)
		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	}

	if err := (*handler.mailClient).SendAccountConfirmationEmail(ctx, morphyxisMailClient.SendAccountConfirmationEmailInput{
		To:                  user.Email,
		Name:                user.Name,
		VerificationCode:    verificationCode,
		AccountDeletionDate: expirationAt,
		Subject:             subjectAccountActivationCode,
	}); err != nil {
		log.Warnf(warnSendingAccountVerifiedEmail+" %v", err)
	}

	rateLimiting.BlockForDuration(time.Minute)

	return ctx.Status(fiber.StatusOK).JSON(ActivationCodeOutput{
		ExpiresAt: expirationAt,
	})
}

// activateAccountHandler godoc
// @Summary Activate user account
// @Description Activates the account for the currently authenticated user.
// @Tags account-activation
// @Produce json
// @Security CookieAuth
// @Param input body accountActivationInput true "Account activation payload"
// @Success 200 {object} accountActivationInput
// @Failure 400 {string} string "Invalid request body"
// @Failure 401 {string} string "Unauthorized"
// @Failure 404 {string} string notFoundActivationCodeError
// @Failure 429 {string} string "Too many requests"
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

	userIdentityString := strconv.Itoa(int(userID))

	rateLimiting := rateLimiting.Init(rateLimiting.RateLimitConfig{
		Ctx:          ctx.Context(),
		UserIp:       ctx.IP(),
		UserIdentity: &userIdentityString,
		EndpointName: "api-account-activation-code-activate",
	})

	if !rateLimiting.ShouldAllowRequest() {
		return ctx.Status(fiber.StatusTooManyRequests).SendString("Too many requests. Please try again later.")
	}

	accountActivationData, err := GetAccountActivationCodeByUserId(ctx, int(userID))
	if err != nil {
		if appErrors.TranslatePostgresDbError(err).FiberNewError().Message == appErrors.ErrNotFound {
			rateLimiting.SaveData()

			return fiber.NewError(fiber.StatusNotFound, notFoundActivationCodeError)
		}

		rateLimiting.SaveData()

		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	}

	if accountActivationData.IsUsed {
		rateLimiting.SaveData()

		return fiber.NewError(fiber.StatusBadRequest, errorCodeAlreadyUsed)
	}

	isValidAndNotExpired, errMessage := isActivationCodeCorrectAndNotExpired(input.Code, accountActivationData.AccountActivationCode, accountActivationData.ExpiresAt)
	if errMessage != "" {
		rateLimiting.SaveData()

		return fiber.NewError(fiber.StatusInternalServerError, errMessage)
	}

	if err := users.UpdateUser(ctx, users.UpdateUserInput{
		ID:         int(userID),
		IsActive:   &isValidAndNotExpired,
		IsVerified: &isValidAndNotExpired,
	}, false); err != nil {
		rateLimiting.SaveData()

		return appErrors.TranslatePostgresDbError(err).FiberNewError()
	}

	rateLimiting.DeleteDataForIp()

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
