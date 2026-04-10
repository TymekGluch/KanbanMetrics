package validation

import (
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
)

func registerJSONTagNames(validatorInstance *validator.Validate) {
	validatorInstance.RegisterTagNameFunc(func(field reflect.StructField) string {
		jsonTag := strings.Split(field.Tag.Get("json"), ",")[0]
		if jsonTag == "" {
			return field.Name
		}

		if jsonTag == "-" {
			return ""
		}

		return jsonTag
	})
}

func registerCustomValidations(validatorInstance *validator.Validate) {
	registerContainsNumberValidation(validatorInstance)
	registerContainsUppercaseValidation(validatorInstance)
	registerContainsSpecialCharacterValidation(validatorInstance)
	registerPasswordValidation(validatorInstance)
}

func InitNewService() *Service {
	validatorInstance := validator.New()
	registerJSONTagNames(validatorInstance)
	registerCustomValidations(validatorInstance)

	return newService(validatorInstance)
}
