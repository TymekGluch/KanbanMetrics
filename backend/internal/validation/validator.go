package validation

import "github.com/go-playground/validator/v10"

func RegisterCustomValidations(validatorInstance *validator.Validate) {
	registerContainsNumberValidation(validatorInstance)
	registerContainsUppercaseValidation(validatorInstance)
	registerContainsSpecialCharacterValidation(validatorInstance)
	registerPasswordValidation(validatorInstance)
}
