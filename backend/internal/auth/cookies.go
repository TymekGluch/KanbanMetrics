package auth

import (
	"time"

	"github.com/gofiber/fiber/v3"
)

const (
	default_auth_cookie_expiration_time = 6 * time.Hour
)

func RemoveAuthCookie(ctx fiber.Ctx) {
	ctx.Cookie(&fiber.Cookie{
		Name:     CookieName,
		Value:    "",
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
		Path:     "/",
		HTTPOnly: true,
		Secure:   cookieSecureEnabled(),
		SameSite: "Lax",
	})
}

func SetAuthCookie(ctx fiber.Ctx, jwtToken string) {
	ctx.Cookie(&fiber.Cookie{
		Name:     CookieName,
		Value:    jwtToken,
		MaxAge:   int(default_auth_cookie_expiration_time / time.Second),
		Expires:  time.Now().UTC().Add(default_auth_cookie_expiration_time),
		Path:     "/",
		HTTPOnly: true,
		Secure:   cookieSecureEnabled(),
		SameSite: "Lax",
	})
}
