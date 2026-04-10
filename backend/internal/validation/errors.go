package validation

import (
	stdErrors "errors"
	"fmt"
	"reflect"
	"strings"

	"KanbanMetrics/internal/appErrors"

	"github.com/go-playground/validator/v10"
)

func translateError(err error) appErrors.ResponseError {
	var invalidValidationErr *validator.InvalidValidationError
	if stdErrors.As(err, &invalidValidationErr) {
		return appErrors.NewInvalidValidationConfigError()
	}

	var validationErrors validator.ValidationErrors
	if !stdErrors.As(err, &validationErrors) {
		return appErrors.NewValidationError(nil)
	}

	return appErrors.NewValidationError(buildFieldErrors(validationErrors))
}

func buildFieldErrors(validationErrors validator.ValidationErrors) []appErrors.FieldError {
	fieldTags := make(map[string]map[string]struct{}, len(validationErrors))
	fieldErrors := make([]appErrors.FieldError, 0, len(validationErrors))
	seenFields := make(map[string]struct{}, len(validationErrors))

	for _, fieldError := range validationErrors {
		field := fieldError.Field()
		if _, ok := fieldTags[field]; !ok {
			fieldTags[field] = map[string]struct{}{}
		}
		fieldTags[field][fieldError.Tag()] = struct{}{}
	}

	for _, fieldError := range validationErrors {
		field := fieldError.Field()
		if _, seen := seenFields[field]; seen {
			continue
		}

		message := translateFieldError(fieldError, fieldTags[field])
		if message == "" {
			continue
		}

		seenFields[field] = struct{}{}
		fieldErrors = append(fieldErrors, appErrors.FieldError{
			Field:   normalizeFieldName(fieldError),
			Message: message,
		})
	}

	return fieldErrors
}

func normalizeFieldName(fieldError validator.FieldError) string {
	field := fieldError.Field()
	if field != "" {
		return field
	}

	return strings.ToLower(fieldError.StructField())
}

func translateFieldError(fieldError validator.FieldError, fieldTags map[string]struct{}) string {
	field := normalizeFieldName(fieldError)

	switch fieldError.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", field)
	case "email":
		return fmt.Sprintf("%s must be a valid email address", field)
	case "min":
		if fieldError.Kind() == reflect.String {
			return fmt.Sprintf("%s must be at least %s characters long", field, fieldError.Param())
		}
		return fmt.Sprintf("%s must be at least %s", field, fieldError.Param())
	case "max":
		if fieldError.Kind() == reflect.String {
			return fmt.Sprintf("%s must be at most %s characters long", field, fieldError.Param())
		}
		return fmt.Sprintf("%s must be at most %s", field, fieldError.Param())
	case "oneof":
		allowedValues := strings.ReplaceAll(fieldError.Param(), " ", ", ")
		return fmt.Sprintf("%s must be one of: %s", field, allowedValues)
	case "password":
		return fmt.Sprintf("%s must contain at least one uppercase letter, one number, and one special character", field)
	case "containsNumber", "containsUppercase", "containsSpecial":
		if _, hasPasswordRule := fieldTags["password"]; hasPasswordRule {
			return ""
		}
		return fmt.Sprintf("%s is invalid", field)
	default:
		return fmt.Sprintf("%s is invalid", field)
	}
}
