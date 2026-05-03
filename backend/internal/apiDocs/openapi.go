package apiDocs

import (
	"encoding/json"
	"fmt"

	"KanbanMetrics/docs"

	"github.com/getkin/kin-openapi/openapi2"
	"github.com/getkin/kin-openapi/openapi2conv"
	"github.com/getkin/kin-openapi/openapi3"
)

const passwordComplexityPattern = `^(?=.*[0-9])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,64}$`

func applyPasswordPatternConstraints(openAPIDoc *openapi3.T) {
	if openAPIDoc == nil {
		return
	}

	for _, schemaRef := range openAPIDoc.Components.Schemas {
		if schemaRef == nil || schemaRef.Value == nil {
			continue
		}

		passwordRef, hasPassword := schemaRef.Value.Properties["password"]
		if !hasPassword || passwordRef == nil || passwordRef.Value == nil {
			continue
		}

		passwordRef.Value.Pattern = passwordComplexityPattern
	}
}

func generateOpenAPIJSON() ([]byte, error) {
	var swaggerDoc openapi2.T
	if err := json.Unmarshal([]byte(docs.SwaggerInfo.ReadDoc()), &swaggerDoc); err != nil {
		return nil, fmt.Errorf("unmarshal swagger document: %w", err)
	}

	openAPIDoc, err := openapi2conv.ToV3(&swaggerDoc)
	if err != nil {
		return nil, fmt.Errorf("convert swagger document to openapi: %w", err)
	}

	applyPasswordPatternConstraints(openAPIDoc)

	openAPIJSON, err := json.MarshalIndent(openAPIDoc, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("marshal openapi document: %w", err)
	}

	return openAPIJSON, nil
}
