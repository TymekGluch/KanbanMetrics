package auth

import (
	"time"

	"github.com/gofiber/fiber/v3"
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
		MaxAge:   int((24 * time.Hour) / time.Second),
		Expires:  time.Now().Add(24 * time.Hour),
		Path:     "/",
		HTTPOnly: true,
		Secure:   cookieSecureEnabled(),
		SameSite: "Lax",
	})
}
