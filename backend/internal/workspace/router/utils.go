package workspaceRouter

import "strconv"

func parseQueryInt(value string, fallback int) (int, error) {
	if value == "" {
		return fallback, nil
	}

	parsedValue, err := strconv.Atoi(value)
	if err != nil {
		return 0, err
	}

	return parsedValue, nil
}

func parseOptionalQueryInt64(value string) (*int64, error) {
	if value == "" {
		return nil, nil
	}

	parsedValue, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return nil, err
	}

	return &parsedValue, nil
}
