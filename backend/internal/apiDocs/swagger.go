package apiDocs

import (
	"strings"

	"KanbanMetrics/docs"
)

func configureSwaggerHost(appURL string) {
	host := strings.TrimPrefix(appURL, "https://")
	host = strings.TrimPrefix(host, "http://")
	if host != "" {
		docs.SwaggerInfo.Host = host
	}
}
