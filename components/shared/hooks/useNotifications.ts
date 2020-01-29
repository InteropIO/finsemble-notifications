import { FinsembleWindow } from "./../../../../finsemble-notifications-seed/finsemble/common/window/FinsembleWindow";
import * as react from "react";
import { WindowIdentifier } from "../../../types/FSBL-definitions/globals";
import INotification from "../../../types/Notification-definitions/INotification";
import Subscription from "../../../types/Notification-definitions/Subscription";
import NotificationClient from "../../../services/notification/notificationClient";
import Filter from "../../../types/Notification-definitions/Filter";
import { SpawnParams } from "../../../types/FSBL-definitions/services/window/Launcher/launcher";

const FSBL = window.FSBL;

const { LauncherClient, WindowClient } = FSBL.Clients;

const initialState = { notifications: [] };

function reducer(
	state: { notifications: INotification[] },
	action: { type: string; payload: INotification }
) {
	switch (action.type) {
		case "update":
			// check to see if the notification exists if so update the values
			const notificationExistsInArray = state.notifications.find(
				(notification: INotification) => notification.id === action.payload.id
			);

			//if the notification exists then do nothing and return the current state else add the the new notification to the state
			const notifications = notificationExistsInArray
				? state.notifications.map((notification: INotification) =>
						notification.id === action.payload.id
							? action.payload
							: notification
				  )
				: [...state.notifications, action.payload];

			return { notifications };
		case "remove":
			return {
				notifications: state.notifications.filter(
					notification => notification.id !== action.payload.id
				)
			};
		default:
			throw new Error();
	}
}

export default function useNotifications() {
	const [state, dispatch] = react.useReducer(reducer, initialState);

	let nClient: NotificationClient = null;

	async function init() {
		try {
			nClient = new NotificationClient();
			const subscription = new Subscription();

			const { includes = null, excludes = null } = await getNotificationConfig(
				WindowClient.getWindowIdentifier().componentType
			);

			const filter: IFilter = new Filter();
			includes && filter.includes.push(includes);
			excludes && filter.excludes.push(excludes);
			subscription.filter = filter;

			subscription.onNotification = function(notification: INotification) {
				// This function will be called when a notification arrives
				dispatch({ type: "update", payload: notification });
			};

			return nClient.subscribe(
				subscription,
				(data: any) => {
					console.log(data);
				},
				(error: any) => {
					console.log(error);
				}
			);
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Example for setting up button clicks
	 *
	 * @param notification
	 * @param action
	 */
	function doAction(notification: INotification, action) {
		try {
			nClient = new NotificationClient();
			nClient.markActionHandled([notification], action).then(() => {
				// NOTE: The request to perform the action has be sent to the notifications service successfully
				// The action itself has not necessarily been perform successfully
				console.log("ACTION success");

				// 1) alert user notification has been sent (action may not have completed)
			});
		} catch (e) {
			// NOTE: The request to perform the action has failed
			console.log("fail", e);
		}
	}

	// start receiving Notifications and putting them in state
	react.useEffect(() => {
		const subscribe = init();
		return () => {
			// Unsubscribe using the subscription ID
			(async () => {
				nClient = new NotificationClient();
				nClient.unsubscribe(await subscribe);
			})();
		};
	}, []); // eslint-disable-line

	/**
	 * Group Notifications by Type
	 * @param notifications
	 */
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

	/**
	 * get the past notifications
	 */
	const getNotificationHistory = () =>
		// TODO: remove the default test value from 2000
		nClient.fetchHistory("2000-01-01T00:00:00.000Z");

	/**
	 * Remove Notification from state
	 * @param notification
	 */
	const removeNotification = (notification: INotification) => {
		dispatch({ type: "remove", payload: notification });
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
	 * Set the position of the notification drawer based on params
	 * @param param0
	 */
	const setNotificationDrawerPosition = async (
		windowShowParams: SpawnParams
	) => {
		const windowId: WindowIdentifier = await LauncherClient.getMyWindowIdentifier();
		await setWindowPosition(windowId, windowShowParams);
	};

	const minimizeWindow = () => {
		WindowClient.minimize(console.log);
	};

	const getWindowSpawnData = () => {
		return WindowClient.getSpawnData();
	};

	const getNotificationConfig = async (
		componentType: string
	): Promise<object | false> => {
		const { data: config } = await LauncherClient.getComponentDefaultConfig(
			componentType
		);

		const notificationsConfigExists =
			config &&
			config.window &&
			config.window.data &&
			config.window.data.notifications;

		return notificationsConfigExists ? config.window.data.notifications : false;
	};

	return {
		doAction,
		getWindowSpawnData,
		getNotificationHistory,
		groupNotificationsByType,
		minimizeWindow,
		notifications: state.notifications,
		removeNotification,
		setNotificationDrawerPosition,
		getNotificationConfig
	};
}
