package auth

type RegisterUserInput struct {
	Name     string `json:"name" validate:"required/min=3"`
	Email    string `json:"email" validate:"required,email,min=3" format:"email"`
	Password string `json:"password" validate:"required,min=8,max=64,password,containsNumber,containsUppercase,containsSpecial" pattern:"^(?=.*[0-9])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,64}$"`
}

type LoginUserInput struct {
	Email    string `json:"email" validate:"required,email,min=3" format:"email"`
	Password string `json:"password" validate:"required,min=8,max=64,password,containsNumber,containsUppercase,containsSpecial" pattern:"^(?=.*[0-9])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,64}$"`
}
