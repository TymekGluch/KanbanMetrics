package users

import (
	"KanbanMetrics/db"
	"context"
	"embed"
	"time"
)

//go:embed sql/*.sql
var sqlFiles embed.FS

type dbCreateUserInput struct {
	Name           string
	Email          string
	HashedPassword string
	Role           string
}

func dbInsertUser(ctx context.Context, input dbCreateUserInput) (int, error) {
	query, err := sqlFiles.ReadFile("sql/insert_user.sql")
	if err != nil {
		return 0, err
	}

	var userId int

	err = db.Pool.QueryRow(ctx, string(query), input.Name, input.Email, input.HashedPassword, input.Role, time.Now()).Scan(&userId)
	if err != nil {
		return 0, err
	}

	return userId, nil
}

func dbDropUser(ctx context.Context, userId int) error {
	query, err := sqlFiles.ReadFile("sql/drop_user.sql")
	if err != nil {
		return err
	}

	_, err = db.Pool.Exec(ctx, string(query), userId)
	if err != nil {
		return err
	}

	return nil
}

type dbUpdateUserInput struct {
	ID             int
	Name           *string
	Email          *string
	hashedPassword *string
	Role           *string
	IsActive       *bool
	IsVerified     *bool
	LastLoginAt    *time.Time
	UpdatedAt      *time.Time
}

func dbUpdateUser(ctx context.Context, input dbUpdateUserInput) error {
	query, err := sqlFiles.ReadFile("sql/update_user.sql")
	if err != nil {
		return err
	}

	_, err = db.Pool.Exec(ctx, string(query), input.ID, input.Name, input.Email, input.Role, input.hashedPassword, input.IsActive, input.IsVerified, input.LastLoginAt, input.UpdatedAt)
	if err != nil {
		return err
	}

	return nil
}

func dbSelectUserById(ctx context.Context, userId int) (*User, error) {
	query, err := sqlFiles.ReadFile("sql/select_user_by_id.sql")
	if err != nil {
		return nil, err
	}

	var user User

	err = db.Pool.QueryRow(ctx, string(query), userId).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.HashedPassword, &user.IsActive, &user.IsVerified, &user.LastLoginAt, &user.UpdatedAt, &user.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func dbSelectUserByEmail(ctx context.Context, email string) (*User, error) {
	query, err := sqlFiles.ReadFile("sql/select_user_by_email.sql")
	if err != nil {
		return nil, err
	}

	var user User

	err = db.Pool.QueryRow(ctx, string(query), email).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.HashedPassword, &user.IsActive, &user.IsVerified, &user.LastLoginAt, &user.UpdatedAt, &user.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
