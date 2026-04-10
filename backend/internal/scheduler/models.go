package scheduler

import (
	"github.com/robfig/cron/v3"
)

type CallbackSchedulerInput struct {
	Callback       func()
	Interval       string
	RunImmediately bool
}

type Worker struct {
	*cron.Cron
}
