import * as React from "react";
import { StoreProvider } from "../shared/stores/NotificationStore";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import { useState } from "react";
import NotificationClient from "../../services/notification/notificationClient";
import Subscription from "../../types/Notification-definitions/Subscription";
import Action from "../../types/Notification-definitions/Action";
import Filter from "../../types/Notification-definitions/Filter";
import Animate from "../shared/components/Animate";
const { useEffect } = React;

function App(): React.ReactElement {
  const { notifications, doAction } = useNotifications();
  const [visible, setVisible] = useState(false);

  return (
    <StoreProvider>
      <Drawer>
        {notifications &&
          notifications.map((notification: INotification) => (
            <Animate
              displayDuration={2000}
              animateIn="slide-in-fwd-bottom"
              animateOut="slide-out-right"
            >
              <Notification
                key={notification.id}
                notification={notification}
                doAction={doAction}
              ></Notification>
            </Animate>
          ))}
      </Drawer>
    </StoreProvider>
  );
}

export default App;
