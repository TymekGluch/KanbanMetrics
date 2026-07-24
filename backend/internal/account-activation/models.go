package accountActivation

import "time"

type AccountActivation struct {
	AccountActivationCode string `json:"code"`
	ExpiresAt             string `json:"expires_at"`
	IsUsed                bool   `json:"is_used"`
}

type accountActivationInput struct {
	Code string `json:"code" validate:"required,len=6"`
}

type ActivationCodeOutput struct {
	ExpiresAt time.Time `json:"expires_at"`
}
