package users

import (
	"time"
)

type User struct {
	ID                             int        `json:"id"`
	Name                           string     `json:"name"`
	Email                          string     `json:"email"`
	HashedPassword                 string     `json:"-"`
	LastLoginAt                    *time.Time `json:"last_login_at,omitempty"`
	Role                           *string    `json:"role,omitempty"`
	IsActive                       *bool      `json:"is_active,omitempty"`
	IsVerified                     *bool      `json:"is_verified,omitempty"`
	IsAccountExpirationDetailsSend *bool      `json:"is_account_expiration_details_send,omitempty"`
	UpdatedAt                      *time.Time `json:"updated_at,omitempty"`
	CreatedAt                      *time.Time `json:"created_at,omitempty"`
}

type CreateUserInput struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=64,password,containsNumber,containsUppercase,containsSpecial"`
	Role     string `json:"role" validate:"required,oneof=app_admin app_user"`
}

type UpdateUserInput struct {
	ID                             int        `json:"id" validate:"required"`
	Name                           *string    `json:"name,omitempty"`
	Email                          *string    `json:"email,omitempty" validate:"omitempty,email"`
	Password                       *string    `json:"password,omitempty" validate:"omitempty,min=8,max=64,password,containsNumber,containsUppercase,containsSpecial"`
	Role                           *string    `json:"role,omitempty" validate:"omitempty,oneof=app_admin app_user"`
	IsActive                       *bool      `json:"is_active,omitempty"`
	IsVerified                     *bool      `json:"is_verified,omitempty"`
	IsAccountExpirationDetailsSend *bool      `json:"is_account_expiration_details_send,omitempty"`
	LastLoginAt                    *time.Time `json:"last_login_at,omitempty"`
}

type UpdateUserHandlerInput struct {
	Name                           *string    `json:"name,omitempty"`
	Email                          *string    `json:"email,omitempty" validate:"omitempty,email"`
	Password                       *string    `json:"password,omitempty" validate:"omitempty,min=8,max=64,password,containsNumber,containsUppercase,containsSpecial"`
	Role                           *string    `json:"role,omitempty" validate:"omitempty,oneof=app_admin app_user"`
	IsActive                       *bool      `json:"is_active,omitempty"`
	IsVerified                     *bool      `json:"is_verified,omitempty"`
	IsAccountExpirationDetailsSend *bool      `json:"is_account_expiration_details_send,omitempty"`
	LastLoginAt                    *time.Time `json:"last_login_at,omitempty"`
}

type droppedUser struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type almostExpiredUser struct {
	ID         int       `json:"id"`
	CreatedAt  time.Time `json:"created_at"`
	IsVerified bool      `json:"is_verified"`
	Email      string    `json:"email"`
}

type getUserLifeCycleConfigInput struct {
	deletionAfterDays              int
	notificationBeforeDeletionDays int
}

type userLifeCycleConfig struct {
	deletionAfterDaysConfig       string
	almostExpiredUsersStartConfig string
	almostExpiredUsersEndConfig   string
}
