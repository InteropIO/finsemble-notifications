import * as react from "react";
import { WindowIdentifier } from "../../../types/FSBL-definitions/globals";
import INotification from "../../../types/Notification-definitions/INotification";
import Subscription from "../../../types/Notification-definitions/Subscription";
import NotificationClient from "../../../services/notification/notificationClient";
import Filter from "../../../types/Notification-definitions/Filter";
import {} from "date-fns";
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
			dispatch({ type: "update", payload: notification });
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
	function doAction(notification: INotification, action) {
		try {
			nClient = new NotificationClient();
			nClient.markActionHandled([notification], action).then(() => {
				// NOTE: The request to perform the action has be sent to the notifications service successfully
				// The action itself has not necessarily been perform successfully
				console.log("ACTION success");
				// this should not be setting a value is a response of success or fail

				// this should be a delete - delete the DOM node
				// dispatch({ type: "update", payload: notification });

				// 1) alert user notification has been sent (action may not have completed)
			});
		} catch (e) {
			// NOTE: The request to perform the action has failed
			console.log("fail", e);
		}
	}

	react.useEffect(() => {
		init();
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
	 * Set the position of the notification window
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

	return {
		notifications: state.notifications,
		doAction,
		groupNotificationsByType,
		setNotificationDrawerPosition,
		minimizeWindow,
		removeNotification,
		getWindowSpawnData
	};
}
