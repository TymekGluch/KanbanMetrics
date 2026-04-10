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
	ID                             int
	Name                           *string
	Email                          *string
	hashedPassword                 *string
	Role                           *string
	IsActive                       *bool
	IsVerified                     *bool
	IsAccountExpirationDetailsSend *bool
	LastLoginAt                    *time.Time
	UpdatedAt                      *time.Time
}

func dbUpdateUser(ctx context.Context, input dbUpdateUserInput) error {
	query, err := sqlFiles.ReadFile("sql/update_user.sql")
	if err != nil {
		return err
	}

	_, err = db.Pool.Exec(ctx, string(query), input.ID, input.Name, input.Email, input.Role, input.hashedPassword, input.IsActive, input.IsVerified, input.IsAccountExpirationDetailsSend, input.LastLoginAt, input.UpdatedAt)
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

	err = db.Pool.QueryRow(ctx, string(query), userId).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.HashedPassword, &user.IsActive, &user.IsVerified, &user.IsAccountExpirationDetailsSend, &user.LastLoginAt, &user.UpdatedAt, &user.CreatedAt)
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

	err = db.Pool.QueryRow(ctx, string(query), email).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.HashedPassword, &user.IsActive, &user.IsVerified, &user.IsAccountExpirationDetailsSend, &user.LastLoginAt, &user.UpdatedAt, &user.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func dbDropExpiredUnverifiedUsersWhichAreNotAdmin(ctx context.Context, expirationInterval string) ([]droppedUser, error) {
	query, err := sqlFiles.ReadFile("sql/drop_expired_unverified_users_which_are_not_admin.sql")
	if err != nil {
		return nil, err
	}

	var droppedUsers []droppedUser

	rows, err := db.Pool.Query(ctx, string(query), expirationInterval)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user droppedUser
		if err := rows.Scan(&user.ID, &user.Email, &user.Name); err != nil {
			return nil, err
		}

		droppedUsers = append(droppedUsers, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return droppedUsers, nil
}

func dbSelectAlmostExpiredUsers(ctx context.Context, expirationInterval string, actionInterval string) ([]almostExpiredUser, error) {
	query, err := sqlFiles.ReadFile("sql/select_almost_expired_users.sql")
	if err != nil {
		return nil, err
	}

	var users []almostExpiredUser

	rows, err := db.Pool.Query(ctx, string(query), expirationInterval, actionInterval)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user almostExpiredUser
		if err := rows.Scan(&user.ID, &user.CreatedAt, &user.IsVerified, &user.Email); err != nil {
			return nil, err
		}

		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func dbSelectUserRoleById(ctx context.Context, userId string) (string, error) {
	query, err := sqlFiles.ReadFile("sql/select_user_role_by_id.sql")
	if err != nil {
		return "", err
	}

	var role string

	err = db.Pool.QueryRow(ctx, string(query), userId).Scan(&role)
	if err != nil {
		return "", err
	}

	return role, nil
}
