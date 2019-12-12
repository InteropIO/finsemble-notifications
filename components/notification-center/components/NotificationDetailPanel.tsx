import * as React from "react";
import INotification from "../../../types/Notification-definitions/INotification";
import { getDate } from "date-fns";

interface Props {
  children?: React.PropsWithChildren<any>;
  notifications: INotification;
}

const NotificationsPanel = (props: Props) => (
  <section id="notification-center__notification-detail">
    <div />
    <div />
    <div />
  </section>
);

export default NotificationsPanel;
