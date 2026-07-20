import { type ValueOf } from "@/types/valueOf";

import {
  ACCOUNT_ACTIVATION_PRIORITIES,
  DAYS_TO_DELETE_ACCOUNT,
  REMAINING_DAYS_FOR_HIGH_PRIORITY,
  REMAINING_DAYS_FOR_MEDIUM_PRIORITY,
} from "./AccountActivation.constants";

export function getRemainingDaysByCreationDate(accountCreationDate?: Date): number | undefined {
  if (!accountCreationDate) {
    return undefined;
  }

  const currentDate = new Date();
  const daysSinceCreationInMilliseconds = Math.floor(
    currentDate.getTime() - accountCreationDate.getTime()
  );

  const daysSinceCreation = Math.floor(daysSinceCreationInMilliseconds / (1000 * 60 * 60 * 24));

  return daysSinceCreation >= DAYS_TO_DELETE_ACCOUNT
    ? 0
    : DAYS_TO_DELETE_ACCOUNT - daysSinceCreation;
}

export function inferAccountActivationPriority(
  accountCreationDate?: Date
): ValueOf<typeof ACCOUNT_ACTIVATION_PRIORITIES> {
  const remainingDays = getRemainingDaysByCreationDate(accountCreationDate);

  if (!accountCreationDate || !remainingDays) {
    return ACCOUNT_ACTIVATION_PRIORITIES.LOW;
  }

  if (remainingDays <= REMAINING_DAYS_FOR_HIGH_PRIORITY) {
    return ACCOUNT_ACTIVATION_PRIORITIES.HIGH;
  }

  if (remainingDays <= REMAINING_DAYS_FOR_MEDIUM_PRIORITY) {
    return ACCOUNT_ACTIVATION_PRIORITIES.MEDIUM;
  }

  return ACCOUNT_ACTIVATION_PRIORITIES.LOW;
}
