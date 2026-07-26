package rateLimiting

import (
	"KanbanMetrics/db"
	"context"
	"time"
)

var (
	monthDuration = 30 * 24 * time.Hour
)

func getDataByKey(ctx context.Context, key string) (*rateLimitingSchema, error) {
	schema := &rateLimitingSchema{}

	err := db.Redis.HGetAll(ctx, key).Scan(schema)
	if err != nil {
		return nil, err
	}

	return schema, nil
}

func setDataByKey(ctx context.Context, key string, schema rateLimitingSchema) error {
	_, err := db.Redis.HSet(ctx, key, schema).Result()
	if err != nil {
		return err
	}

	db.Redis.Expire(ctx, key, monthDuration)

	return nil
}

func deleteDataByKey(ctx context.Context, key string) error {
	_, err := db.Redis.Del(ctx, key).Result()
	if err != nil {
		return err
	}

	return nil
}
