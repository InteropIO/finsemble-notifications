import * as React from "react";
import useNotifications from "../hooks/useNotifications";
import NotificationCenter from "./components/NotificationCenter";
import FilterPanel from "./components/FilterPanel";
import NotificationsPanel from "./components/NotificationsPanel";
import NotificationDetailPanel from "./components/NotificationDetailPanel";
import INotification from "../../types/Notification-definitions/INotification";

const App = (): React.ReactElement => {
  const { notifications } = useNotifications();

  const types: string[] = Array.from(
    new Set(notifications.map((item: INotification) => item.type))
  );

  return (
    <div id="app">
      <NotificationCenter title="Notification Center">
        <FilterPanel types={types} />
        <NotificationsPanel notifications={notifications} />
        <NotificationDetailPanel />
      </NotificationCenter>
    </div>
  );
};

export default App;
