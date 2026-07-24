package turnstileIntegration

import (
	"github.com/gofiber/fiber/v3"
)

const (
	errorMissingTurnstileToken            = "missing Turnstile token"
	errorTurnstileVerificationUnavailable = "Turnstile verification unavailable"
	errorTurnstileVerificationFailed      = "Turnstile verification failed"
)

func (client *Client) VerifyMiddleware(ctx fiber.Ctx) error {
	token := ctx.Get(turnstileHeaderKey)

	if token == "" {
		return fiber.NewError(
			fiber.StatusBadRequest,
			errorMissingTurnstileToken,
		)
	}

	result, err := client.Verify(ctx.Context(), token)
	if err != nil {
		return fiber.NewError(
			fiber.StatusBadGateway,
			errorTurnstileVerificationUnavailable,
		)
	}

	if !result {
		return fiber.NewError(
			fiber.StatusForbidden,
			errorTurnstileVerificationFailed,
		)
	}

	return ctx.Next()
}
