import { NotificationRootComponent } from "./Notification.client";

interface NotificationInterface {
  Root: typeof NotificationRootComponent;
}

const Notification: NotificationInterface = {
  Root: NotificationRootComponent,
};

export default Notification;
