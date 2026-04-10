package scheduler

import (
	"github.com/robfig/cron/v3"
)

const (
	defaultInterval = "@every 5m"

	WORKER_INTERVAL_ONE_MINUTE     = "@every 1m"
	WORKER_INTERVAL_FIVE_MINUTES   = "@every 5m"
	WORKER_INTERVAL_TEN_MINUTES    = "@every 10m"
	WORKER_INTERVAL_THIRTY_MINUTES = "@every 30m"
	WORKER_INTERVAL_ONE_HOUR       = "@every 1h"
	WORKER_INTERVAL_SIX_HOURS      = "@every 6h"
	WORKER_INTERVAL_TWELVE_HOURS   = "@every 12h"

	WORKER_INTERVAL_DAILY  = "@daily"
	WORKER_INTERVAL_WEEKLY = "@weekly"
)

func InitCallbackWorker() *Worker {
	worker := cron.New(cron.WithChain(
		cron.SkipIfStillRunning(cron.DefaultLogger),
	))

	worker.Start()

	return &Worker{
		Cron: worker,
	}
}

func (worker *Worker) RegisterJob(input CallbackSchedulerInput) (cron.EntryID, error) {
	if input.RunImmediately {
		go input.Callback()
	}

	var interval string

	if input.Interval != "" {
		interval = input.Interval
	} else {
		interval = defaultInterval
	}

	return worker.AddFunc(interval, input.Callback)
}

func (worker *Worker) Stop() {
	worker.Cron.Stop()
}
