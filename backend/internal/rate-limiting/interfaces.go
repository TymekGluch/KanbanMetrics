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

	return PrefixKey + ":" + config.UserIp + optionalUserIdentity + ":" + config.EndpointName
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
		count = schema.AttemptCount
	}

	return rateLimitingSchema{
		AttemptCount: count + 1,
		IsBlocked:    count >= limit,
		BlockedUntil: config.getProgressiveWindowExpirationTime(),
	}
}

func (config *RateLimitConfig) getProgressiveWindowExpirationTime() *time.Time {
	schema, _ := getDataByKey(config.Ctx, config.buildKey())
	now := time.Now()

	var limit int
	if config.Limit != nil {
		limit = *config.Limit
	} else {
		limit = defaultLimit
	}

	switch {
	case schema.AttemptCount == limit:
		time := now.Add(time.Second * 30)
		return &time
	case schema.AttemptCount == limit+1:
		time := now.Add(time.Minute * 1)
		return &time
	case schema.AttemptCount == limit+2:
		return nil
	case schema.AttemptCount == limit+3:
		time := now.Add(time.Minute * 5)
		return &time
	case schema.AttemptCount >= limit+4:
		if (schema.AttemptCount-(limit+4))%2 == 0 {
			return nil
		}

		time := now.Add(time.Minute * 10)
		return &time
	default:
		return nil
	}
}
