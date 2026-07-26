package rateLimiting

import (
	"context"
	"time"
)

type RateLimitConfig struct {
	Ctx          context.Context
	UserIp       string
	UserIdentity *string
	EndpointName string
	Limit        *int
}

type rateLimitingSchema struct {
	AttemptCount int        `redis:"attempt_count"`
	IsBlocked    bool       `redis:"is_blocked"`
	BlockedUntil *time.Time `redis:"blocked_until"`
}

type RateLimiter struct {
	ctx    context.Context
	schema rateLimitingSchema
	key    string
}
