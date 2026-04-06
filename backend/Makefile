include .env

migrate-up:
	migrate -path migrations -database $(DB_URL) up

migrate-down:
	migrate -path schema_migrations -database $(DB_URL) down