package appConfig

import (
	"KanbanMetrics/utils"
	"encoding/json"
	"os"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

var (
	defaultHeaders = "Content-Type, Authorization"
)

func defaultHTTPConfig() fiber.Handler {
	var allowedOrigins []string
	var allowedHeaders []string

	origins := os.Getenv("ALLOWED_ORIGINS")
	if origins == "" || origins == "[]" {
		allowedOrigins = []string{"*"}
	} else {
		allowedOrigins = parseAllowedOrigins(origins)
	}

	headers := os.Getenv("DEFAULT_HEADERS")
	if headers == "" || headers == "[]" {
		allowedHeaders = parseAllowedHeaders(defaultHeaders)
	} else {
		allowedHeaders = parseAllowedHeaders(headers)
	}

	return cors.New(cors.Config{
		AllowOrigins: allowedOrigins,
		AllowHeaders: allowedHeaders,
	})
}

func parseAllowedHeaders(headers string) []string {
	headers = strings.TrimSpace(headers)

	if strings.HasPrefix(headers, "[") {
		var parsed []string
		if err := json.Unmarshal([]byte(headers), &parsed); err == nil && len(parsed) > 0 {
			return parsed
		}
	}

	parts := strings.Split(headers, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}

	uniqueResult := utils.UniqueSlice(result)

	return uniqueResult
}

func parseAllowedOrigins(origins string) []string {
	origins = strings.TrimSpace(origins)

	if strings.HasPrefix(origins, "[") {
		var parsed []string

		if err := json.Unmarshal([]byte(origins), &parsed); err == nil && len(parsed) > 0 {
			return sanitizeOrigins(parsed)
		}
	}

	parts := strings.Split(origins, ",")
	result := make([]string, 0, len(parts))

	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}

	return sanitizeOrigins(result)
}

func sanitizeOrigins(origins []string) []string {
	result := make([]string, 0, len(origins))

	for _, origin := range origins {
		normalized := strings.TrimSpace(origin)
		if normalized == "" {
			continue
		}

		if normalized == "*" {
			return []string{"*"}
		}

		if !strings.Contains(normalized, "://") {
			normalized = "http://" + normalized
		}

		if strings.HasPrefix(normalized, "http://") || strings.HasPrefix(normalized, "https://") {
			result = append(result, normalized)
		}
	}

	if len(result) == 0 {
		return []string{"*"}
	}

	return result
}
