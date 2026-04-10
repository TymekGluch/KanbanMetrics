package appErrors

import (
	stdErrors "errors"
	"net/http"

	"github.com/gofiber/fiber/v3"
)

const (
	ErrInvalidRequestData        = "Request data is invalid"
	ErrInvalidValidationConfig   = "Validation is misconfigured"
	ErrInternalServerError       = "Internal server error"
	ErrUnknownDatabaseError      = "An unknown database error occurred"
	ErrUniqueViolation           = "A record with the same unique value already exists"
	ErrConflict                  = "The request could not be completed due to a conflict with the current state of the resource"
	ErrEmailAlreadyInUse         = "Email is already in use"
	ErrReferencedResourceMissing = "Referenced resource does not exist"
	ErrMissingRequiredField      = "Missing required field"
	ErrInvalidFieldValue         = "Invalid field value"
	ErrInvalidFieldLength        = "Field value is too long"
	ErrConstraintViolation       = "Provided data violates a business constraint"
	ErrDatabaseTemporarilyBusy   = "Database is temporarily busy, please retry"
	ErrDatabaseTimeout           = "Database timeout, please retry"
)

type AppError struct {
	message string
	status  int
}

type FiberMappableError interface {
	error
	Status() int
	FiberNewError() *fiber.Error
}

type ResponseError interface {
	error
	Status() int
	Send(ctx fiber.Ctx) error
}

func (appErr *AppError) Error() string {
	return appErr.message
}

func (appErr *AppError) Status() int {
	return appErr.status
}

func newAppError(message string, status int) *AppError {
	return &AppError{message: message, status: status}
}

func (appErr *AppError) FiberNewError() *fiber.Error {
	return fiber.NewError(appErr.status, appErr.message)
}

func (appErr *AppError) Send(_ fiber.Ctx) error {
	return appErr.FiberNewError()
}

func NewInvalidValidationConfigError() *AppError {
	return newAppError(ErrInvalidValidationConfig, fiber.StatusInternalServerError)
}

func Send(ctx fiber.Ctx, err error) error {
	if err == nil {
		return nil
	}

	var responseErr ResponseError
	if stdErrors.As(err, &responseErr) {
		return responseErr.Send(ctx)
	}

	var fiberErr *fiber.Error
	if stdErrors.As(err, &fiberErr) {
		return fiberErr
	}

	return fiber.NewError(http.StatusInternalServerError, ErrInternalServerError)
}
