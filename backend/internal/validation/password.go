package validation

import (
	"strings"
	"unicode"

	"github.com/go-playground/validator/v10"
)

func registerContainsNumberValidation(validatorInstance *validator.Validate) {
	validatorInstance.RegisterValidation("containsNumber", validateContainsNumber)
}

func registerContainsUppercaseValidation(validatorInstance *validator.Validate) {
	validatorInstance.RegisterValidation("containsUppercase", validateContainsUppercase)
}

func registerContainsSpecialCharacterValidation(validatorInstance *validator.Validate) {
	validatorInstance.RegisterValidation("containsSpecial", validateContainsSpecialCharacter)
}

func registerPasswordValidation(validatorInstance *validator.Validate) {
	validatorInstance.RegisterValidation("password", validatePassword)
}

func validateContainsNumber(fieldContext validator.FieldLevel) bool {
	fieldValue := fieldContext.Field().String()
	return stringContainsNumber(fieldValue)
}

func validateContainsUppercase(fieldContext validator.FieldLevel) bool {
	fieldValue := fieldContext.Field().String()
	return stringContainsUppercase(fieldValue)
}

func validateContainsSpecialCharacter(fieldContext validator.FieldLevel) bool {
	fieldValue := fieldContext.Field().String()
	return stringContainsSpecialCharacter(fieldValue)
}

func validatePassword(fieldContext validator.FieldLevel) bool {
	passwordValue := fieldContext.Field().String()

	return stringContainsNumber(passwordValue) &&
		stringContainsUppercase(passwordValue) &&
		stringContainsSpecialCharacter(passwordValue)
}

func stringContainsNumber(text string) bool {
	return strings.ContainsAny(text, "0123456789")
}

func stringContainsUppercase(text string) bool {
	for _, character := range text {
		if unicode.IsUpper(character) {
			return true
		}
	}
	return false
}

func stringContainsSpecialCharacter(text string) bool {
	for _, character := range text {
		if !unicode.IsLetter(character) && !unicode.IsNumber(character) {
			return true
		}
	}
	return false
}
