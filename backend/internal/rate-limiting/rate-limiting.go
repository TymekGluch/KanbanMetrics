package rateLimiting

import "time"

func InitRateLimiting(config RateLimitConfig) RateLimiter {
	key := config.buildKey()

	currentSchema, _ := getDataByKey(config.ctx, key)
	schema := config.buildSchema(currentSchema)

	return RateLimiter{
		ctx:    config.ctx,
		schema: schema,
		key:    key,
	}
}

func (rateLimiter *RateLimiter) shouldAllowRequest() bool {
	schema, _ := getDataByKey(rateLimiter.ctx, rateLimiter.key)
	if schema == nil {
		return true
	}

	now := time.Now()

	if schema.isBlocked {
		if schema.blockedUntil != nil && now.Before(*schema.blockedUntil) {
			return false
		}
	}

	return true
}

func (rateLimiter *RateLimiter) deleteDataForIp() error {
	return deleteDataByKey(rateLimiter.ctx, rateLimiter.key)
}

func (rateLimiter *RateLimiter) saveData() error {
	return setDataByKey(rateLimiter.ctx, rateLimiter.key, rateLimiter.schema)
}
