package users

import (
	"KanbanMetrics/internal/scheduler"
	"context"
	"fmt"
	"log"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
)

const (
	DefaultDeletionAfterDays              = 12
	defaultNotificationBeforeDeletionDays = 3
)

func runCleanupPipeline(ctx context.Context, mailClient *morphyxisMailClient.MailServiceClient) {
	config := getUserLifeCycleConfig(getUserLifeCycleConfigInput{
		deletionAfterDays:              DefaultDeletionAfterDays,
		notificationBeforeDeletionDays: defaultNotificationBeforeDeletionDays,
	})

	users, err := deleteExpiredUnverifiedUsersWhichAreNotAdmin(ctx, config.deletionAfterDaysConfig)
	if err != nil {
		fmt.Printf("Error while deleting expired unverified users: %v\n", err)
	} else {
		for _, user := range users {
			fmt.Printf("Deleted user with email: %s\n, and Id: %d\n", user.Email, user.ID)

			err := (*mailClient).SendDeletedAccountEmail(ctx, morphyxisMailClient.SendDeletedAccountEmailInput{
				To:      user.Email,
				Name:    user.Name,
				Subject: "Account Deletion Notification",
				Reason:  "Your account has been deleted due to not being verified within the allowed time frame.",
			})
			if err != nil {
				log.Fatal(err)
			}
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

		fmt.Printf("check")

		err := (*mailClient).SendAccountConfirmationEmail(ctx, morphyxisMailClient.SendAccountConfirmationEmailInput{
			To:                  user.Email,
			Name:                user.Name,
			Subject:             "Account Expiration Details",
			VerificationCode:    "213721",
			AccountDeletionDate: user.CreatedAt.AddDate(0, 0, DefaultDeletionAfterDays),
		})
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("User was notified about expiration account details for user with email: %s\n", user.Email)
	}
}

func ExpiredUnverifiedUsersCleanupService(ctx context.Context, schedulerDependency *scheduler.Worker, mailClient *morphyxisMailClient.MailServiceClient) {
	schedulerDependency.RegisterJob(scheduler.CallbackSchedulerInput{
		Callback:       func() { runCleanupPipeline(ctx, mailClient) },
		Interval:       scheduler.WORKER_INTERVAL_SIX_HOURS,
		RunImmediately: true,
	})
}
