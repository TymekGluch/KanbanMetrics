package auth

type RegisterUserInput struct {
	Name     string  `json:"name" validate:"required"`
	Email    string  `json:"email" validate:"required,email"`
	Password string  `json:"password" validate:"required,min=8,max=64,password,containsNumber,containsUppercase,containsSpecial"`
	Role     *string `json:"role,omitempty" validate:"omitempty,oneof=admin user"`
}

type LoginUserInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=64,password,containsNumber,containsUppercase,containsSpecial"`
}
