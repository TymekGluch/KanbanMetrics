package rateLimiting

import (
	"context"
	"time"
)

type RateLimitConfig struct {
	ctx            context.Context
	UserIp         string
	UserIdentity   *string
	endpointName   string
	Limit          *int
	WindowDuration time.Duration
}

type rateLimitingSchema struct {
	attemptCount int        `redis:"attempt_count"`
	isBlocked    bool       `redis:"is_blocked"`
	blockedUntil *time.Time `redis:"blocked_until"`
}

type RateLimiter struct {
	ctx    context.Context
	schema rateLimitingSchema
	key    string
}
