package accountActivation

import (
	"KanbanMetrics/db"
	"context"
	"embed"
	"time"
)

//go:embed sql/*.sql
var sqlFiles embed.FS

type dbInsertAccountActivationCodeInput struct {
	ID int
}

func dbInsertAccountActivationCode(ctx context.Context, input dbInsertAccountActivationCodeInput) (string, time.Time, error) {
	query, err := sqlFiles.ReadFile("sql/insert_code.sql")
	if err != nil {
		return "", time.Time{}, err
	}

	var id int
	var AccountActivationCode string
	var expirationTime time.Time

	err = db.Pool.QueryRow(ctx, string(query), input.ID).Scan(&id, &AccountActivationCode, &expirationTime)
	if err != nil {
		return "", time.Time{}, err
	}

	return AccountActivationCode, expirationTime, nil
}

type dbSelectAccountActivationCodeByIDOutput struct {
	ID                    int
	AccountActivationCode string
	ExpirationTime        time.Time
}

func dbSelectAccountActivationCodeByID(ctx context.Context, id int) (dbSelectAccountActivationCodeByIDOutput, error) {
	query, err := sqlFiles.ReadFile("sql/select_code_by_user_id.sql")
	if err != nil {
		return dbSelectAccountActivationCodeByIDOutput{}, err
	}

	var AccountActivationCode string
	var expirationTime time.Time

	err = db.Pool.QueryRow(ctx, string(query), id).Scan(&id, &AccountActivationCode, &expirationTime)
	if err != nil {
		return dbSelectAccountActivationCodeByIDOutput{}, err
	}

	return dbSelectAccountActivationCodeByIDOutput{
		ID:                    id,
		AccountActivationCode: AccountActivationCode,
		ExpirationTime:        expirationTime,
	}, nil
}

func dbDropExpiredAccountActivationCodes(ctx context.Context) error {
	query, err := sqlFiles.ReadFile("sql/drop_expired_codes.sql")
	if err != nil {
		return err
	}

	_, err = db.Pool.Exec(ctx, string(query))
	if err != nil {
		return err
	}

	return nil
}
