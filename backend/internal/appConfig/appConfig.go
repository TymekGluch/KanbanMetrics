package appConfig

import (
	"os"

	"github.com/gofiber/fiber/v3"
)

type loadConfigReturnType struct {
	AppPort string
	AppURL  string
}

const (
	defaultServerPort = ":3000"
)

func Load() loadConfigReturnType {
	port := os.Getenv("BE_SERVER_PORT")
	if port == "" {
		port = defaultServerPort
	}

	appURL := os.Getenv("APP_URL")

	return loadConfigReturnType{
		AppPort: port,
		AppURL:  appURL,
	}
}

func SetupCorsAndHeaders() fiber.Handler {
	return defaultHTTPConfig()
}
