package auth

import (
	"KanbanMetrics/internal/users"
	"context"
	"time"
)

func RegisterUser(ctx context.Context, input RegisterUserInput) (string, error) {
	var role string

	role = users.APP_ROLE_USER

	payload := users.CreateUserInput{
		Email:    input.Email,
		Name:     input.Name,
		Password: input.Password,
		Role:     role,
	}

	id, err := users.CreateUser(ctx, payload)
	if err != nil {
		return "", err
	}

	token, err := GenerateJwtToken(uint(id))
	if err != nil {
		return "", err
	}

	return token, nil
}

func LoginUser(ctx context.Context, input LoginUserInput) (string, error) {
	user, err := users.GetUserByEmail(ctx, input.Email)
	if err != nil {
		return "", err
	}

	if err := users.ComparePasswordAndHash(input.Password, user.HashedPassword); err != nil {
		return "", err
	}

	now := time.Now()

	updateUserPayload := users.UpdateUserInput{
		ID:          user.ID,
		LastLoginAt: &now,
	}

	users.UpdateUser(ctx, updateUserPayload, false)

	token, err := GenerateJwtToken(uint(user.ID))
	if err != nil {
		return "", err
	}

	return token, nil
}

func LogoutUser(ctx context.Context) error {
	_ = ctx
	return nil
}
