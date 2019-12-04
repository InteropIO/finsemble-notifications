import { useContext, useState, useEffect } from "react";
import { RouterMessage } from "../FSBL-definitions/clients/IRouterClient";
import { WindowClient } from "../FSBL-definitions/clients/windowClient";
import { WindowIdentifier } from "../FSBL-definitions/globals";

const FSBL = window.FSBL;

const { RouterClient, LauncherClient } = FSBL.Clients;

export default function useNotifications() {
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		RouterClient.addListener(
			"notifications",
			async (err, incomingNotification: RouterMessage<INotification>) => {
				err && console.error(err);
				addNotificationToState(incomingNotification);
				//await showWindow();
			}
		);
	});

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

	return { notifications };
}
