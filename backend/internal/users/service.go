package users

import (
	"KanbanMetrics/internal/scheduler"
	"context"
	"fmt"
)

const (
	defaultDeletionAfterDays              = 12
	defaultNotificationBeforeDeletionDays = 3
)

func runCleanupPipeline(ctx context.Context) {
	config := getUserLifeCycleConfig(getUserLifeCycleConfigInput{
		deletionAfterDays:              defaultDeletionAfterDays,
		notificationBeforeDeletionDays: defaultNotificationBeforeDeletionDays,
	})

	users, err := deleteExpiredUnverifiedUsersWhichAreNotAdmin(ctx, config.deletionAfterDaysConfig)
	if err != nil {
		fmt.Printf("Error while deleting expired unverified users: %v\n", err)
	} else {
		for _, user := range users {
			fmt.Printf("Deleted user with email: %s\n, and Id: %d\n", user.Email, user.ID)
		}
	}

	almostExpiredUsers, err := getAlmostExpiredUsers(ctx, config.almostExpiredUsersStartConfig, config.almostExpiredUsersEndConfig)
	if err != nil {
		fmt.Printf("Error while selecting almost expired users: %v\n", err)
	}

	for _, user := range almostExpiredUsers {
		isDetailsSend := true

		UpdateUser(ctx, UpdateUserInput{
			ID:                             user.ID,
			IsAccountExpirationDetailsSend: &isDetailsSend,
		}, false)

		// TODO: Implement notification sending logic here, e.g. send email to user.Email probably mailer service should be implemented for that

		fmt.Printf("Should notify user about expiration account details for user with email: %s\n", user.Email)
	}
}

func ExpiredUnverifiedUsersCleanupService(ctx context.Context, schedulerDependency *scheduler.Worker) {
	schedulerDependency.RegisterJob(scheduler.CallbackSchedulerInput{
		Callback:       func() { runCleanupPipeline(ctx) },
		Interval:       scheduler.WORKER_INTERVAL_SIX_HOURS,
		RunImmediately: true,
	})
}
