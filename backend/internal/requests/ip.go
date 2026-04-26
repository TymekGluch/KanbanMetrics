package requests

import "github.com/gofiber/fiber/v3"

const (
	xForwardedForHeader = "X-Forwarded-For"
	xRealIPHeader       = "X-Real-IP"
)

func GetIpAddressFromFiberCtx(ctx fiber.Ctx) string {
	ip := ctx.Get(xForwardedForHeader)
	if ip == "" {
		ip = ctx.Get(xRealIPHeader)
	}
	if ip == "" {
		ip = ctx.IP()
	}

	return ip
}
