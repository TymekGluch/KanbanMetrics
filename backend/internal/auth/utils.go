package auth

import (
	"os"
	"strings"
)

func cookieSecureEnabled() bool {
	value := strings.ToLower(strings.TrimSpace(os.Getenv("COOKIE_SECURE")))
	return value == "1" || value == "true" || value == "yes"
}

func verifyTokenHelper(tokenString string) (bool, error) {
	return VerifyJwtTokenString(tokenString)
}
