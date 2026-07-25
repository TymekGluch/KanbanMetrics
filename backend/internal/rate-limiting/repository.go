package rateLimiting

import (
	"KanbanMetrics/db"
	"context"
)

var (
	redisClient = db.Redis
)

func getDataByKey(ctx context.Context, key string) (*rateLimitingSchema, error) {
	var schema *rateLimitingSchema

	err := redisClient.HGetAll(ctx, key).Scan(&schema)
	if err != nil {
		return nil, err
	}

	return schema, nil
}

func setDataByKey(ctx context.Context, key string, schema rateLimitingSchema) error {
	_, err := redisClient.HSet(ctx, key, schema).Result()
	if err != nil {
		return err
	}

	return nil
}

func deleteDataByKey(ctx context.Context, key string) error {
	_, err := redisClient.Del(ctx, key).Result()
	if err != nil {
		return err
	}

	return nil
}
