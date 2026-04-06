package apiDocs

import (
	"encoding/json"
	"fmt"

	"KanbanMetrics/docs"

	"github.com/getkin/kin-openapi/openapi2"
	"github.com/getkin/kin-openapi/openapi2conv"
)

func generateOpenAPIJSON() ([]byte, error) {
	var swaggerDoc openapi2.T
	if err := json.Unmarshal([]byte(docs.SwaggerInfo.ReadDoc()), &swaggerDoc); err != nil {
		return nil, fmt.Errorf("unmarshal swagger document: %w", err)
	}

	openAPIDoc, err := openapi2conv.ToV3(&swaggerDoc)
	if err != nil {
		return nil, fmt.Errorf("convert swagger document to openapi: %w", err)
	}

	openAPIJSON, err := json.MarshalIndent(openAPIDoc, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("marshal openapi document: %w", err)
	}

	return openAPIJSON, nil
}
