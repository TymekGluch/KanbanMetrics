package validation

import "github.com/go-playground/validator/v10"

type Service struct {
	validator *validator.Validate
}

func newService(validatorInstance *validator.Validate) *Service {
	return &Service{validator: validatorInstance}
}

func (service *Service) Struct(input any) error {
	if err := service.validator.Struct(input); err != nil {
		return translateError(err)
	}

	return nil
}
