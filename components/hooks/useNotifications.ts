import { useContext, useState, useEffect } from "react";
import { RouterMessage } from "../../types/FSBL-definitions/clients/IRouterClient";
import { WindowClient } from "../../types/FSBL-definitions/clients/windowClient";
import { WindowIdentifier } from "../../types/FSBL-definitions/globals";
import INotification from "../../types/Notification-definitions/INotification";
import Subscription from "../../types/Notification-definitions/Subscription";
import NotificationClient from "../../services/notification/notificationClient";
import Action from "../../types/Notification-definitions/Action";
import Filter from "../../types/Notification-definitions/Filter";
import {} from "date-fns";

const FSBL = window.FSBL;

const { RouterClient, LauncherClient } = FSBL.Clients;

export default function useNotifications() {
  const [notifications, setNotifications] = useState<INotification[] | []>([]);

  let nClient = new NotificationClient();
  let subscription = new Subscription();
  let action = new Action();
  let filter = new Filter();

  action.buttonText = "sdfd";
  filter.size = { gte: 30 };
  subscription.filters.push(filter);

  subscription.onNotification = function(notification: INotification) {
    // This function will be called when a notification arrives
    setNotifications([...notifications, notification]);
  };
  useEffect(() => {
    subscription.onNotification = function(notification: INotification) {
      // This function will be called when a notification arrives
      setNotifications([...notifications, notification]);
    };
    // nClient.subscribe(
    //   subscription,
    //   (data: any) => {
    //     console.log(data);
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );
    // RouterClient.addListener(
    //   "notifications",
    //   async (err, incomingNotification: RouterMessage<INotification>) => {
    //     err && console.error(err);
    //     addNotificationToState(incomingNotification);
    //     //await showWindow();
    //   }
    // );
  });

  const getAllNotifications = (): INotification[] => {
    const today = new Date();
    const filter = new Filter();
    const notifications = new NotificationClient().fetchHistory(today);
  };
  const removeNotification = (id: string) => {
    const notificationRemoved: INotification[] = notifications.filter(
      (notification: INotification): boolean => notification.id !== id
    );
    setNotifications(notificationRemoved);
  };

  const addNotificationToState = (incomingNotification: INotification) => {
    setNotifications([incomingNotification, ...notifications]);
  };

  const getNotifications = (notifications: Array<INotification>) => {
    // get a list of the notifications
  };
  const dismissNotification = (notificationID: string) => {
    /* 		 dismiss the notification and remove it from state on success
		(should this wait for a promise to resolve?)
		should it receive the notification back with a new state i.e active = false?
		*/
  };
  const notificationAction = (notificationID: string, action: string) => {
    // action to happen on notification - sent as a string
  };

  const showWindow = async () => {
    // tslint:disable-next-line: ter-max-len
    const windowIdentifier:
      | WindowIdentifier
      | any = await LauncherClient.getMyWindowIdentifier();
    const x = await LauncherClient.showWindow(windowIdentifier, {
      // position: "relative",
      // height: "900px"
    });
    console.log(x);
    return x;
  };

  return { notifications, getAllNotifications };
}
