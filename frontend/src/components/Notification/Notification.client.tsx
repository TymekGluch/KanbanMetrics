"use client";

import React from "react";
import type { NotificationRootProps } from "./Notification.types";

export function NotificationRootComponent(props: NotificationRootProps) {
  const { children } = props;

  const [isDialogOpen, SetIsDialogOpen] = React.useState(false);

  return <>{children}</>;
}
