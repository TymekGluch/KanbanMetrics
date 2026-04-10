package users

import (
	"context"
	"fmt"
	"strconv"
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
		ID:                             input.ID,
		Name:                           input.Name,
		Email:                          input.Email,
		hashedPassword:                 hashedPassword,
		Role:                           input.Role,
		IsActive:                       input.IsActive,
		IsVerified:                     input.IsVerified,
		IsAccountExpirationDetailsSend: input.IsAccountExpirationDetailsSend,
		LastLoginAt:                    input.LastLoginAt,
		UpdatedAt:                      updateTime,
	}

	return dbUpdateUser(ctx, dbInput)
}

func GetUserById(ctx context.Context, userId int) (*User, error) {
	return dbSelectUserById(ctx, userId)
}

func GetUserByEmail(ctx context.Context, email string) (*User, error) {
	return dbSelectUserByEmail(ctx, email)
}

func getUserLifeCycleConfig(input getUserLifeCycleConfigInput) userLifeCycleConfig {
	intervalForSelectAlmostExpiredUsers := input.deletionAfterDays - input.notificationBeforeDeletionDays
	intervalExcludeLastHourBeforeDeletion := fmt.Sprintf("%d days 23 hours", input.deletionAfterDays-1)

	return userLifeCycleConfig{
		deletionAfterDaysConfig:       fmt.Sprintf("%d days", input.deletionAfterDays),
		almostExpiredUsersStartConfig: fmt.Sprintf("%d days", intervalForSelectAlmostExpiredUsers),
		almostExpiredUsersEndConfig:   intervalExcludeLastHourBeforeDeletion,
	}
}

func deleteExpiredUnverifiedUsersWhichAreNotAdmin(ctx context.Context, expirationInterval string) ([]droppedUser, error) {
	return dbDropExpiredUnverifiedUsersWhichAreNotAdmin(ctx, expirationInterval)
}

func getAlmostExpiredUsers(ctx context.Context, expirationInterval string, actionInterval string) ([]almostExpiredUser, error) {
	return dbSelectAlmostExpiredUsers(ctx, expirationInterval, actionInterval)
}

func GetUserRoleById(ctx context.Context, userId uint) (string, error) {
	return dbSelectUserRoleById(ctx, strconv.FormatUint(uint64(userId), 10))
}
