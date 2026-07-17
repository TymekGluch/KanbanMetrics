package accountActivation

type AccountActivation struct {
	AccountActivationCode string `json:"code"`
	ExpiresAt             string `json:"expires_at"`
}

type accountActivationInput struct {
	Code string `json:"code" validate:"required,len=6"`
}
