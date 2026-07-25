package rateLimiting

import (
	"time"
)

func (config *RateLimitConfig) buildKey() string {
	var optionalUserIdentity string
	if config.UserIdentity != nil {
		optionalUserIdentity = ":" + *config.UserIdentity
	} else {
		optionalUserIdentity = ""
	}

	return PrefixKey + ":" + config.endpointName + ":" + config.UserIp + optionalUserIdentity + ":" + config.endpointName
}

func (config *RateLimitConfig) buildSchema(schema *rateLimitingSchema) rateLimitingSchema {
	var limit int
	if config.Limit != nil {
		limit = *config.Limit
	} else {
		limit = defaultLimit
	}

	count := startAttemptCount
	if schema != nil {
		count = schema.attemptCount
	}

	return rateLimitingSchema{
		attemptCount: count + 1,
		isBlocked:    count >= limit,
		blockedUntil: config.getProgressiveWindowExpirationTime(),
	}
}

func (config *RateLimitConfig) getProgressiveWindowExpirationTime() *time.Time {
	schema, _ := getDataByKey(config.ctx, config.buildKey())
	now := time.Now()

	var limit int
	if config.Limit != nil {
		limit = *config.Limit
	} else {
		limit = defaultLimit
	}

	switch {
	case schema.attemptCount == limit:
		time := now.Add(time.Second * 30)
		return &time
	case schema.attemptCount == limit+1:
		time := now.Add(time.Minute * 1)
		return &time
	case schema.attemptCount == limit+2:
		time := now.Add(time.Minute * 5)
		return &time
	case schema.attemptCount >= limit+3:
		time := now.Add(time.Minute * 10)
		return &time
	default:
		return nil
	}
}
