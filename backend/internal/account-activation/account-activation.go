package accountActivation

import (
	"context"
	"time"
)

func GetAccountActivationCodeByUserId(ctx context.Context, ID int) (AccountActivation, error) {
	result, err := dbSelectAccountActivationCodeByID(ctx, ID)
	if err != nil {
		return AccountActivation{}, err
	}
	return AccountActivation{
		AccountActivationCode: result.AccountActivationCode,
		ExpiresAt:             result.ExpirationTime.Format(time.RFC3339),
	}, nil
}

func GenerateAccountActivationCode(ctx context.Context, ID int) (string, time.Time, error) {
	return dbInsertAccountActivationCode(ctx, dbInsertAccountActivationCodeInput{
		ID: ID,
	})
}

func DeleteAllExpiredAccountActivationCodes(ctx context.Context) error {
	return dbDropExpiredAccountActivationCodes(ctx)
}
