package appErrors

import (
	stdErrors "errors"
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5/pgconn"
)

func TranslatePostgresDbError(err error) FiberMappableError {
	var pgErr *pgconn.PgError

	if !stdErrors.As(err, &pgErr) {
		return newAppError(ErrUnknownDatabaseError, http.StatusInternalServerError)
	}

	constraintName := strings.ToLower(strings.TrimSpace(pgErr.ConstraintName))

	switch pgErr.Code {
	case "23505":
		switch constraintName {
		case "users_email_key", "users_email_lower_unique":
			return newAppError(ErrEmailAlreadyInUse, http.StatusConflict)
		default:
			return newAppError(ErrUniqueViolation, http.StatusConflict)
		}
	case "23503":
		return newAppError(ErrReferencedResourceMissing, http.StatusConflict)
	case "23502":
		return newAppError(ErrMissingRequiredField, http.StatusBadRequest)
	case "23514":
		return newAppError(ErrConstraintViolation, http.StatusBadRequest)
	case "22P02":
		return newAppError(ErrInvalidFieldValue, http.StatusBadRequest)
	case "22001":
		return newAppError(ErrInvalidFieldLength, http.StatusBadRequest)
	case "22003", "22007":
		return newAppError(ErrInvalidFieldValue, http.StatusBadRequest)
	case "40001", "40P01":
		return newAppError(ErrDatabaseTemporarilyBusy, http.StatusServiceUnavailable)
	case "57014":
		return newAppError(ErrDatabaseTimeout, http.StatusGatewayTimeout)
	case "53300", "08006":
		return newAppError(ErrDatabaseTemporarilyBusy, http.StatusServiceUnavailable)
	case "P0001":
		return newAppError(ErrConflict, http.StatusConflict)
	default:
		return newAppError(ErrConflict, http.StatusConflict)
	}
}
