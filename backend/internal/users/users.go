package users

import (
	"context"
	"time"
)

func CreateUser(ctx context.Context, input CreateUserInput) (int, error) {
	hashedPassword, err := HashPassword(input.Password)
	if err != nil {
		return 0, err
	}

	dbInput := dbCreateUserInput{
		Name:           input.Name,
		Email:          input.Email,
		HashedPassword: hashedPassword,
		Role:           input.Role,
	}

	return dbInsertUser(ctx, dbInput)
}

func DeleteUser(ctx context.Context, userId int) error {
	return dbDropUser(ctx, userId)
}

func UpdateUser(ctx context.Context, input UpdateUserInput, shouldMarkAsUpdated bool) error {
	var hashedPassword *string
	var updateTime *time.Time

	if shouldMarkAsUpdated {
		now := time.Now()
		updateTime = &now
	}

	if input.Password != nil {
		hashed, err := HashPassword(*input.Password)
		if err != nil {
			return err
		}

		hashedPassword = &hashed
	}

	dbInput := dbUpdateUserInput{
		ID:             input.ID,
		Name:           input.Name,
		Email:          input.Email,
		hashedPassword: hashedPassword,
		Role:           input.Role,
		IsActive:       input.IsActive,
		IsVerified:     input.IsVerified,
		LastLoginAt:    input.LastLoginAt,
		UpdatedAt:      updateTime,
	}

	return dbUpdateUser(ctx, dbInput)
}

func GetUserById(ctx context.Context, userId int) (*User, error) {
	return dbSelectUserById(ctx, userId)
}

func GetUserByEmail(ctx context.Context, email string) (*User, error) {
	return dbSelectUserByEmail(ctx, email)
}
