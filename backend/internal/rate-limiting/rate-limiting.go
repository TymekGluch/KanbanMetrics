package rateLimiting

import (
	"time"

	"github.com/gofiber/fiber/v3/log"
)

func Init(config RateLimitConfig) RateLimiter {
	key := config.buildKey()

	currentSchema, err := getDataByKey(config.Ctx, key)
	if err != nil {
		log.Warnf("Error retrieving rate limiting data: %v", err)
	}
	schema := config.buildSchema(currentSchema)

	return RateLimiter{
		ctx:    config.Ctx,
		schema: schema,
		key:    key,
	}
}

func (rateLimiter *RateLimiter) ShouldAllowRequest() bool {
	schema, err := getDataByKey(rateLimiter.ctx, rateLimiter.key)
	if err != nil {
		log.Errorf("Error retrieving rate limiting data: %v", err)
	}
	if schema == nil {
		return true
	}

	now := time.Now()

	if schema.IsBlocked {
		if schema.BlockedUntil != nil && now.Before(*schema.BlockedUntil) {
			return false
		}
	}

	return true
}

func (rateLimiter *RateLimiter) DeleteDataForIp() error {
	return deleteDataByKey(rateLimiter.ctx, rateLimiter.key)
}

func (rateLimiter *RateLimiter) SaveData() error {
	log.Infof("Saving rate limiting data for key: %s, schema: %+v", rateLimiter.key, rateLimiter.schema)

	err := setDataByKey(rateLimiter.ctx, rateLimiter.key, rateLimiter.schema)
	if err != nil {
		log.Errorf("Error saving rate limiting data: %v", err)
		return err
	}

	return nil
}

func (rateLimiter *RateLimiter) BlockForDuration(duration time.Duration) error {
	blockedUntil := time.Now().Add(duration)

	log.Infof("Blocking rate limiting data for key: %s until: %v", rateLimiter.key, blockedUntil)

	err := setDataByKey(rateLimiter.ctx, rateLimiter.key, rateLimitingSchema{
		AttemptCount: rateLimiter.schema.AttemptCount,
		IsBlocked:    true,
		BlockedUntil: &blockedUntil,
	})
	if err != nil {
		log.Errorf("Error blocking rate limiting data: %v", err)
		return err
	}

	return nil
}
