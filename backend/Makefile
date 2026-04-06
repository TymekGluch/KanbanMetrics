include .env

migrate-up:
	migrate -path migrations -database $(DB_URL) up

migrate-down:
	migrate -path migrations -database $(DB_URL) down

.PHONY: docs
docs:
	swag init -g main.go --parseInternal

.PHONY: openapi
openapi: docs
	npx -y swagger2openapi docs/swagger.json -o $(OPENAPI_FILE)

.PHONY: types-check
types-check: openapi
	npx -y openapi-typescript $(OPENAPI_FILE) > /dev/null

.PHONY: zod
zod: openapi
	npx -y openapi-zod-client $(OPENAPI_FILE) -o $(OPENAPI_ZOD_FILE) --export-schemas --export-types --with-docs

.PHONY: api-artifacts
api-artifacts: openapi types-check zod postman-collection

docs-clean:
	rm -rf docs/

.PHONY: openapi-clean
openapi-clean:
	rm -f $(OPENAPI_FILE)

.PHONY: zod-clean
zod-clean:
	rm -f $(OPENAPI_ZOD_FILE)

docs-install:
	go install github.com/swaggo/swag/cmd/swag@latest

.PHONY: postman-collection
postman-collection: openapi
	mkdir -p postman
	npx -y openapi-to-postmanv2 -s $(OPENAPI_FILE) -o $(POSTMAN_COLLECTION_FILE) -p

.PHONY: postman-clean
postman-clean:
	rm -f $(POSTMAN_COLLECTION_FILE)

.PHONY: help
help:
	@echo "Available targets:"
	@echo "  migrate-up      - Run pending migrations"
	@echo "  migrate-down    - Rollback migrations"
	@echo "  docs            - Generate Swagger API documentation"
	@echo "  openapi         - Convert Swagger docs to OpenAPI 3"
	@echo "  types-check     - Verify OpenAPI types can be generated"
	@echo "  zod             - Generate Zod schemas/client from OpenAPI"
	@echo "  api-artifacts   - Generate and verify all API artifacts"
	@echo "  docs-install    - Install swag CLI tool"
	@echo "  docs-clean      - Clean generated documentation"
	@echo "  openapi-clean   - Remove generated OpenAPI file"
	@echo "  zod-clean       - Remove generated Zod file"
	@echo "  postman-collection - Generate Postman collection from OpenAPI"
	@echo "  postman-clean   - Remove generated Postman collection"
	@echo "  help            - Show this help message"