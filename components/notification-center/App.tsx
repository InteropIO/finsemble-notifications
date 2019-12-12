import * as React from "react";
import useNotifications from "../hooks/useNotifications";
import NotificationCenter from "./components/NotificationCenter";
import FilterPanel from "./components/FilterPanel";
import NotificationsPanel from "./components/NotificationsPanel";
import NotificationDetailPanel from "./components/NotificationDetailPanel";

const App = (): React.ReactElement => {
  const { notifications } = useNotifications();
  return (
    <div id="app">
      <NotificationCenter title="Notification Center">
        <FilterPanel />
        <NotificationsPanel notifications={notifications} />
        <NotificationDetailPanel notification />
      </NotificationCenter>
    </div>
  );
};

export default App;
