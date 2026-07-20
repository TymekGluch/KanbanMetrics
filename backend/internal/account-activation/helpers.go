package accountActivation

import (
	"time"
)

const (
	errorInvalidActivationCode = "Activation code does not match"
	errorActivationCodeExpired = "Activation code has expired"
)

func isActivationCodeCorrectAndNotExpired(providedCode string, storedCode string, expirationTime string) (bool, string) {
	if providedCode != storedCode {
		return false, errorInvalidActivationCode
	}

	expiration, err := time.Parse(time.RFC3339, expirationTime)
	if err != nil {
		return false, err.Error()
	}

	if time.Now().After(expiration) {
		return false, errorActivationCodeExpired
	}

	return true, ""
}
