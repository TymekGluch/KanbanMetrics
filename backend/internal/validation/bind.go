package validation

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"

	"github.com/gofiber/fiber/v3"
)

func BindJSONStrict(ctx fiber.Ctx, out any) error {
	decoder := json.NewDecoder(bytes.NewReader(ctx.Request().Body()))
	decoder.DisallowUnknownFields()

	if err := decoder.Decode(out); err != nil {
		if errors.Is(err, io.EOF) {
			return errors.New("empty request body")
		}

		return err
	}

	if err := decoder.Decode(&struct{}{}); err != nil {
		if errors.Is(err, io.EOF) {
			return nil
		}

		return err
	}

	return errors.New("request body must contain a single JSON object")
}
