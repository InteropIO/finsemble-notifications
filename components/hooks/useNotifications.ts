import {
  useContext,
  useState,
  useEffect,
  useRef,
  DOMElement,
  ReactElement,
  MutableRefObject
} from "react";
import { RouterMessage } from "../../types/FSBL-definitions/clients/IRouterClient";
import { WindowClient } from "../../types/FSBL-definitions/clients/windowClient";
import { SpawnParams } from "../../types/FSBL-definitions/services/window/Launcher/launcher";
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
  // useRef to get the value https://stackoverflow.com/questions/53845595/wrong-react-hooks-behaviour-with-event-listener
  let notificationsRef = useRef(notifications);

  const nClient = new NotificationClient();
  const subscription = new Subscription();
  const action = new Action();
  const filter = new Filter();

  action.buttonText = "sdfd";
  filter.size = { gte: 30 };
  subscription.filters.push(filter);
  subscription.onNotification = (notification: INotification) => {
    notificationsRef.current = [notification, ...notificationsRef.current];
    // console.log(notification);
    setNotifications(notificationsRef.current);
  };

  useEffect(() => console.log("mounted or updated"));

  useEffect(() => {
    // let subscription = new Subscription();
    // console.warn(subscription);
    // subscribeToNotification(subscription);
    nClient.subscribe(
      subscription,
      (data: any) => {
        console.log(data);
      },
      (error: any) => {
        console.log(error);
      }
    );

    return () => {
      // Put unsubscribe here
    }

    // Will run every time deps change. Set as described in the Note section:
    // https://reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update
  }, ['empty or const value will only run once']);

  const groupNotificationsByType = (
    notifications: INotification[]
  ): { [type: string]: INotification[] } => {
    const groupBy = (arr: INotification[], type: string) =>
      arr
        .map(
          (notification: INotification): INotification["type"] =>
            notification[type]
        )
        .reduce(
          (
            acc: { [x: string]: any },
            notificationType: INotification["type"],
            index: number
          ) => {
            acc[notificationType] = [
              ...(acc[notificationType] || []),
              arr[index]
            ];
            return acc;
          },
          {}
        );

    return groupBy(notifications, "type");
  };

  const getAllNotifications = (): Array<INotification> => {
    // get the history and then subscribe
    const today = new Date();
    const filter = new Filter();
    // const notifications = new NotificationClient().fetchHistory(today);
    const a = [
      {
        id: "123",
        type: "a",
        title: "title",
        issuedAt: new Date(),
        isActive: true
      },
      {
        id: "123",
        type: "b",
        title: "title",
        issuedAt: new Date(),
        isActive: true
      },
      {
        id: "143",
        type: "a",
        title: "title",
        issuedAt: new Date(),
        isActive: true
      },
      {
        id: "162",
        type: "a",
        title: "title",
        issuedAt: new Date(),
        isActive: true
      },
      {
        id: "162",
        type: "c",
        title: "title",
        issuedAt: new Date(),
        isActive: true
      },
      {
        id: "162",
        type: "c",
        title: "title",
        issuedAt: new Date(),
        isActive: true
      },
      {
        id: "162",
        type: "c",
        title: "title",
        issuedAt: new Date(),
        isActive: true
      },
      {
        id: "162",
        type: "c",
        title: "title",
        issuedAt: new Date(),
        isActive: true
      },
      {
        id: "162",
        type: "c",
        title: "title",
        issuedAt: new Date(),
        isActive: true
      }
    ];

    return a;
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

  /**
   * Set the position of the notification window
   * @param param0
   */
  const setNotificationDrawerPosition = async (
    element: MutableRefObject<any>,
    { bottom, right, monitor }: SpawnParams
  ) => {
    const windowId: WindowIdentifier = await LauncherClient.getMyWindowIdentifier();
    const windowShowParams: SpawnParams = {
      bottom,
      right,
      height: element.current.getBoundingClientRect().height + 20,
      width: element.current.getBoundingClientRect().width + 20,
      position: "available",
      monitor
    };

    await setWindowPosition(windowId, windowShowParams);
  };

  const setWindowPosition = async (
    windowId: WindowIdentifier,
    windowShowParams: SpawnParams
  ): Promise<any> => {
    const { windowDescriptor: windowPosition } = (
      await LauncherClient.showWindow(windowId, windowShowParams)
    ).data;
    return windowPosition;
  };

  return {
    notifications,
    getAllNotifications,
    groupNotificationsByType,
    setNotificationDrawerPosition
  };
}
