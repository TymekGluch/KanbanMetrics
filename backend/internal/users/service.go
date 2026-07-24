package users

import (
	"KanbanMetrics/internal/scheduler"
	"context"
	"fmt"
	"log"
	"time"

	morphyxisMailClient "github.com/TymekGluch/Morphyxis-mail-service/pkg/morphyxis-mail-client"
)

type GenerateActivationCodeFunc func(ctx context.Context, userID int) (string, time.Time, error)

const (
	DefaultDeletionAfterDays              = 12
	defaultNotificationBeforeDeletionDays = 3
)

func runCleanupPipeline(ctx context.Context, mailClient *morphyxisMailClient.MailServiceClient, generateActivationCode GenerateActivationCodeFunc) {
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

		code, _, err := generateActivationCode(ctx, user.ID)
		if err != nil {
			log.Fatal(err)
		}

		err = (*mailClient).SendAccountConfirmationEmail(ctx, morphyxisMailClient.SendAccountConfirmationEmailInput{
			To:                  user.Email,
			Name:                user.Name,
			Subject:             "KanbanMetrics: Your account will be deleted soon, please confirm your account",
			VerificationCode:    code,
			AccountDeletionDate: user.CreatedAt.AddDate(0, 0, DefaultDeletionAfterDays),
		})
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("User was notified about expiration account details for user with email: %s\n", user.Email)
	}
}

func ExpiredUnverifiedUsersCleanupService(ctx context.Context, schedulerDependency *scheduler.Worker, mailClient *morphyxisMailClient.MailServiceClient, generateActivationCode GenerateActivationCodeFunc) {
	schedulerDependency.RegisterJob(scheduler.CallbackSchedulerInput{
		Callback:       func() { runCleanupPipeline(ctx, mailClient, generateActivationCode) },
		Interval:       scheduler.WORKER_INTERVAL_SIX_HOURS,
		RunImmediately: true,
	})
}
