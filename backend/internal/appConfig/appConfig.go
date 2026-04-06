package appConfig

import (
	"os"

	"github.com/gofiber/fiber/v3"
)

type loadConfigReturnType struct {
	AppPort string
}

const (
	defaultServerPort = ":3000"
)

func Load() loadConfigReturnType {
	port := os.Getenv("BE_SERVER_PORT")
	if port == "" {
		port = defaultServerPort
	}

	return loadConfigReturnType{
		AppPort: port,
	}
}

func SetupCorsAndHeaders() fiber.Handler {
	return defaultHTTPConfig()
}
