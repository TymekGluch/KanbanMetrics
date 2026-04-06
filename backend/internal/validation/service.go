package validation

import "github.com/go-playground/validator/v10"

type Service struct {
	validator *validator.Validate
}

func NewService(validatorInstance *validator.Validate) *Service {
	return &Service{validator: validatorInstance}
}

func (s *Service) Struct(input any) error {
	return s.validator.Struct(input)
}