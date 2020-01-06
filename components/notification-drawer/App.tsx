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
const { useEffect } = React;

const initialState = { notifications: [] };

function reducer(
  state: { notifications: INotification[] },
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case "add":
      // TODO: can this be mitigated by stopping updates via a hook?
      const notifications = state.notifications.find(
        notification => notification.id === action.payload.id
      )
        ? state.notifications
        : [...state.notifications, action.payload];
      return { notifications };
    case "remove":
      const newStateWithoutItem = state.notifications.filter(
        notification => notification.id !== action.payload.id
      );
      return { notifications: newStateWithoutItem };
    default:
      throw new Error();
  }
}

function App(): React.ReactElement {
  const { notifications } = useNotifications();
  const [visible, setVisible] = useState(false);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  let nClient: NotificationClient = null;

  // when the button to hide is hit then animate disappearing,
  // the opposite should happen when it is shown again.
  function init() {
    nClient = new NotificationClient();
    const subscription = new Subscription();

    // const action = new Action();
    // action.buttonText = "sdfd";

    // const filter = new Filter();
    // filter.size = { gte: 30 };
    // subscription.filters.push(filter);

    subscription.onNotification = function(notification: INotification) {
      // This function will be called when a notification arrives
      dispatch({ type: "add", payload: notification });
    };

    const subscriptionId = nClient.subscribe(
      subscription,
      (data: any) => {
        console.log(data);
      },
      (error: any) => {
        console.log(error);
      }
    );

    // TODO: Unsubscribe using the subscription ID
  }

  /**
   * Example for setting up button clicks
   *
   * @param notification
   * @param action
   */
  function doAction(notification, action) {
    try {
      nClient = new NotificationClient();
      nClient.markActionHandled([notification], action).then(() => {
        // NOTE: The request to perform the action has be sent to the notifications service successfully
        // The action itself has not necessarily been perform successfully
        console.log("ACTION success");
        dispatch({ type: "remove", payload: notification });
      });
    } catch (e) {
      // NOTE: The request to perform the action has failed
      console.log("fail", e);
    }
  }

  useEffect(() => {
    init();
  }, []); // eslint-disable-line

  return (
    <StoreProvider>
      <Drawer>
        {state &&
          state.notifications.map((notification: INotification) => (
            <Notification
              key={notification.id}
              notification={notification}
              doAction={doAction}
            ></Notification>
          ))}
      </Drawer>
    </StoreProvider>
  );
}

export default App;
