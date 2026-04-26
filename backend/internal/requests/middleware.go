package requests

import (
	"context"
	"time"

	"KanbanMetrics/internal/appErrors"

	"github.com/gofiber/fiber/v3"
)

var (
	defaultRequestTimeout = 30 * time.Second
)

type TimeoutConfig struct {
	Timeout *time.Duration
}

func TimeoutMiddleware(config TimeoutConfig) fiber.Handler {
	timeout := config.Timeout
	if timeout == nil {
		timeout = &defaultRequestTimeout
	}

	return func(ctx fiber.Ctx) error {
		timeoutCtx, cancel := context.WithTimeout(ctx.Context(), *timeout)
		defer cancel()

		ctx.SetContext(timeoutCtx)

		err := ctx.Next()
		if timeoutCtx.Err() == context.DeadlineExceeded {
			return appErrors.NewRequestTimeoutError().FiberNewError()
		}

		return err
	}
}
