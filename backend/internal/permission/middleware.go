package permission

import "github.com/gofiber/fiber/v3"

const (
	ErrorForbidden = "Forbidden"
)

type Middleware struct {
	authorizer Authorizer
}

func NewMiddleware(authorizer Authorizer) *Middleware {
	return &Middleware{authorizer: authorizer}
}

func (middleware *Middleware) Require(permission Permission) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		role, err := ContextUserRole(ctx)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		}

		if !middleware.authorizer.HasPermission(role, permission) {
			return fiber.NewError(fiber.StatusForbidden, ErrorForbidden)
		}

		return ctx.Next()
	}
}

func (middleware *Middleware) RequireAny(permissions ...Permission) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		role, err := ContextUserRole(ctx)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		}

		for _, permission := range permissions {
			if middleware.authorizer.HasPermission(role, permission) {
				return ctx.Next()
			}
		}

		return fiber.NewError(fiber.StatusForbidden, ErrorForbidden)
	}
}
