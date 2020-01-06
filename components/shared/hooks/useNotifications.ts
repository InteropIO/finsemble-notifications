import { useState, useEffect, MutableRefObject } from "react";
import { SpawnParams } from "../../../types/FSBL-definitions/services/window/Launcher/launcher";
import { WindowIdentifier } from "../../../types/FSBL-definitions/globals";
import INotification from "../../../types/Notification-definitions/INotification";
import Subscription from "../../../types/Notification-definitions/Subscription";
import NotificationClient from "../../../services/notification/notificationClient";
import Filter from "../../../types/Notification-definitions/Filter";
import {} from "date-fns";

const FSBL = window.FSBL;

const { LauncherClient } = FSBL.Clients;

export default function useNotifications() {
  const [notifications, setNotifications] = useState<INotification[] | []>([]);

  const notificationClient = new NotificationClient();

  // const nClient = new NotificationClient();
  // nClient.subscribe(
  //   subscription,
  //   (data: any) => {
  //     console.log(data);
  //   },
  //   (error: any) => {
  //     console.log(error);
  //   }
  // );
  // const action = new Action();
  // const filter = new Filter();

  // action.buttonText = "sdfd";
  // filter.size = { gte: 30 };
  // subscription.filters.push(filter);

  const subscription = new Subscription();
  useEffect(() => {
    subscription.onNotification = async (notification: INotification) =>
      await setNotifications(notificationList => [
        notification,
        ...notificationList
      ]);
    return () => {};
  }, []); // eslint-disable-line

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

  const setWindowPosition = async (
    windowId: WindowIdentifier,
    windowShowParams: SpawnParams
  ): Promise<any> => {
    const { windowDescriptor: windowPosition } = (
      await LauncherClient.showWindow(windowId, windowShowParams)
    ).data;
    return windowPosition;
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
      width: element.current.getBoundingClientRect().width + 40,
      position: "available",
      monitor
    };

    await setWindowPosition(windowId, windowShowParams);
  };

  return {
    notifications,
    getAllNotifications,
    groupNotificationsByType,
    setNotificationDrawerPosition
  };
}
