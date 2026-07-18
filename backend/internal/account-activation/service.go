package accountActivation

import (
	"KanbanMetrics/internal/scheduler"
	"context"

	"github.com/gofiber/fiber/v3/log"
)

const (
	WarnDeletingExpiredAccountActivationCodes = "Warning deleting expired account activation codes:"
)

func runCleanupPipeline(ctx context.Context) {
	if err := DeleteAllExpiredAccountActivationCodes(ctx); err != nil {
		log.Warn(WarnDeletingExpiredAccountActivationCodes, " ", err.Error())
	} else {
		log.Info("Expired account activation codes cleanup completed successfully.")
	}
}

func ExpiredAccountActivationCodesCleanupService(ctx context.Context, schedulerDependency *scheduler.Worker) {
	schedulerDependency.RegisterJob(scheduler.CallbackSchedulerInput{
		Callback:       func() { runCleanupPipeline(ctx) },
		Interval:       scheduler.WORKER_INTERVAL_SIX_HOURS,
		RunImmediately: true,
	})
}
