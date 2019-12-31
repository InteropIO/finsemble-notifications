import * as React from "react";
import { StoreProvider } from "../shared/stores/NotificationStore";
import Drawer from "./components/Drawer";
import Notification from "./components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";

function App(): React.ReactElement {
  const { notifications } = useNotifications();
  return (
    <StoreProvider>
      <Drawer>
        {notifications.map((notification: INotification) => (
          <Notification
            key={notification.id}
            notification={notification}
          ></Notification>
        ))}
      </Drawer>
    </StoreProvider>
  );
}

export default App;
