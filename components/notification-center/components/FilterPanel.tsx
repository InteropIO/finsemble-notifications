import * as React from "react";
import INotification from "../../../types/Notification-definitions/INotification";
import { getDate } from "date-fns";

interface Props {
  children?: React.PropsWithChildren<any>;
  notifications: Array<INotification>;
}

const NotificationsPanel = (props: Props) => (
  <section id="notification-center__notification-filter-panel">
    <div />
    <div />
    <div />
  </section>
);

export default NotificationsPanel;
