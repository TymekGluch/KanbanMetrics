package appErrors

import (
	"github.com/gofiber/fiber/v3"
)

type FieldError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type ValidationErrorResponse struct {
	Message string       `json:"message"`
	Fields  []FieldError `json:"fields,omitempty"`
}

type ValidationError struct {
	message string
	status  int
	fields  []FieldError
}

func NewValidationError(fields []FieldError) *ValidationError {
	fieldsCopy := append([]FieldError(nil), fields...)

	return &ValidationError{
		message: ErrInvalidRequestData,
		status:  fiber.StatusBadRequest,
		fields:  fieldsCopy,
	}
}

func (validationErr *ValidationError) Error() string {
	return validationErr.message
}

func (validationErr *ValidationError) Status() int {
	return validationErr.status
}

func (validationErr *ValidationError) Fields() []FieldError {
	return append([]FieldError(nil), validationErr.fields...)
}

func (validationErr *ValidationError) Response() ValidationErrorResponse {
	return ValidationErrorResponse{
		Message: validationErr.message,
		Fields:  validationErr.Fields(),
	}
}

func (validationErr *ValidationError) Send(ctx fiber.Ctx) error {
	return ctx.Status(validationErr.status).JSON(validationErr.Response())
}
