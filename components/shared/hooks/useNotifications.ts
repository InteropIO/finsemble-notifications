import { ToggleComponent } from "./../../../types/Notification-definitions/NotificationHookTypes.d";
import { FSBL } from "./../../../types/FSBL-definitions/globals.d";
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as react from "react";
import { WindowIdentifier } from "../../../types/FSBL-definitions/globals";
import INotification from "../../../types/Notification-definitions/INotification";
import Subscription from "../../../types/Notification-definitions/Subscription";
import NotificationClient from "../../../services/notification/notificationClient";
import Filter from "../../../types/Notification-definitions/Filter";
import { SpawnParams } from "../../../types/FSBL-definitions/services/window/Launcher/launcher";
import WindowConfig, { NotificationsConfig } from "../../../types/Notification-definitions/NotificationConfig";
import IFilter from "../../../types/Notification-definitions/IFilter";
import { NotificationGroupList } from "../../../types/Notification-definitions/NotificationHookTypes";
const _get = require("lodash.get");

const FSBL = window.FSBL;

const { LauncherClient, WindowClient } = FSBL.Clients;

const initialState: any = { notifications: [] };

/*
Action Types
*/
const CREATE_MULTIPLE = "CREATE_MULTIPLE";
const UPDATE = "UPDATE";
const REMOVE = "REMOVE";

/*
	Reducer
	*/
function reducer(state: { notifications: INotification[] }, action: { type: string; payload: any }) {
	switch (action.type) {
		case CREATE_MULTIPLE:
			return {
				notifications: [...state.notifications, ...action.payload]
			};
		case UPDATE:
			// check to see if the notification exists if so update the values
			const notificationExistsInArray = state.notifications.find(
				(notification: INotification) => notification.id === action.payload.id
			);

			//if the notification exists then do nothing and return the current state else add the the new notification to the state
			const notifications = notificationExistsInArray
				? state.notifications.map((notification: INotification) =>
						notification.id === action.payload.id ? action.payload : notification
				  )
				: [...state.notifications, action.payload];

			return { notifications };
		case REMOVE:
			return {
				notifications: state.notifications.filter(notification => notification.id !== action.payload.id)
			};
		default:
			throw new Error();
	}
}

export default function useNotifications() {
	const [state, dispatch] = react.useReducer(reducer, initialState);

	let NOTIFICATION_CLIENT: NotificationClient = null;

	/*
		Action Creators
	*/
	const removeNotification = (notification: INotification) => {
		dispatch({ type: REMOVE, payload: notification });
	};

	const addNotification = (notification: INotification) => {
		dispatch({ type: UPDATE, payload: notification });
	};

	const addMultipleNotifications = (notifications: INotification[]) => {
		dispatch({ type: CREATE_MULTIPLE, payload: notifications });
	};

	// start receiving Notifications and putting them in state
	react.useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const subscribe = init();
		return () => {
			// Unsubscribe using the subscription ID
			(async () => {
				NOTIFICATION_CLIENT = new NotificationClient();
				NOTIFICATION_CLIENT.unsubscribe(await subscribe);
			})();
		};
	}, []); // eslint-disable-line

	/**
	 * Example for setting up button clicks
	 *
	 * @param notification
	 * @param action
	 */
	function doAction(notification: INotification, action: any) {
		try {
			NOTIFICATION_CLIENT = new NotificationClient();
			NOTIFICATION_CLIENT.performAction([notification], action).then(() => {
				// NOTE: The request to perform the action has be sent to the notifications service successfully
				// The action itself has not necessarily been perform successfully
				console.log("ACTION success");

				// 1) alert user notification has been sent (action may not have completed)
			});
		} catch (e) {
			// NOTE: The request to perform the action has failed
			console.error("could not create a notification client", e);
		}
	}

	/**
	 * Group Notifications by Type
	 * @param notifications
	 */
	const groupNotificationsByType = (notifications: INotification[]): NotificationGroupList => {
		const groupBy = (arr: INotification[], type: keyof INotification) =>
			arr
				.map(
					(notification: INotification): INotification["type"] =>
						//TODO: this does not work as expected without the ignore
						//@ts-ignore
						notification[type]
				)
				.reduce((acc: { [x: string]: any }, notificationType: INotification["type"], index: number) => {
					acc[notificationType] = [...(acc[notificationType] || []), arr[index]];
					return acc;
				}, {});

		return groupBy(notifications, "type");
	};

	/**
	 * 	 * get the past notifications
	 * WARNING - The default will get all notifications all the way back from 1969!!!
	 * @param since
	 * @param filter
	 */
	const getNotificationHistory = (
		since = "1969-12-31T23:59:59.999Z",
		filter: null | IFilter = null
	): Promise<INotification[]> => {
		NOTIFICATION_CLIENT = new NotificationClient();
		return NOTIFICATION_CLIENT.fetchHistory(since, filter);
	};

	//TODO: move out to a Finsemble hook and import here
	/**
	 * Get Notification's config from
	 * @param componentType Finsemble component type e.g "Welcome-Component"
	 */
	const getNotificationConfig = async (componentType: string): Promise<NotificationsConfig> => {
		const { data }: any = await LauncherClient.getComponentDefaultConfig(componentType);

		const config: WindowConfig = data;

		return _get(config, "window.data.notifications", null);
	};

	//TODO: move out to a Finsemble hook and import here
	/*
	Finsemble Window manipulation
*/

	const setWindowPosition = async (windowId: WindowIdentifier, windowShowParams: SpawnParams): Promise<any> => {
		const { windowDescriptor: windowPosition } = (await LauncherClient.showWindow(windowId, windowShowParams)).data;
		return windowPosition;
	};

	/**
	 * Set the position of the notification drawer based on params
	 * @param param0
	 */
	const setNotificationDrawerPosition = async (windowShowParams: SpawnParams) => {
		const windowId: WindowIdentifier = await LauncherClient.getMyWindowIdentifier();
		await setWindowPosition(windowId, windowShowParams);
	};

	const minimizeWindow = () => {
		// WindowClient.minimize(console.log);
		window.finsembleWindow && window.finsembleWindow.hide();
	};

	const getWindowSpawnData = () => {
		return WindowClient.getSpawnData();
	};

	const toggleComponent = async ({
		windowName,
		componentType,
		showAction,
		hideAction
	}: ToggleComponent): Promise<void> => {
		//set window.name to make the it easier to wrap (as name will be fixed)
		const { wrap: component } = await FSBL.FinsembleWindow.wrap({ windowName }, (err: Error, wrap: object) =>
			err ? console.error : wrap
		);

		//toggle visibility (onto monitor its being called on!)
		component.isShowing({}, (err: Error, isShowing: boolean) => {
			try {
				if (isShowing) {
					// default action
					!hideAction ? component.hide() : hideAction();
				} else {
					// default action
					!showAction
						? LauncherClient.showWindow({ windowName, componentType }, { spawnIfNotFound: true })
						: showAction();
				}
			} catch (error) {
				console.error(error);
			}
		});
	};

	/**
	 * Main init function to start the subscription
	 */
	async function init() {
		try {
			NOTIFICATION_CLIENT = new NotificationClient();
			const subscription = new Subscription();

			const notificationConfig: NotificationsConfig = await getNotificationConfig(
				await WindowClient.getWindowIdentifier().componentType
			);

			const filter: IFilter = new Filter();

			// make filters from the config
			if (notificationConfig) {
				notificationConfig.filter &&
					notificationConfig.filter.include &&
					filter.include.push(...notificationConfig.filter.include);

				notificationConfig.filter &&
					notificationConfig.filter.exclude &&
					filter.exclude.push(...notificationConfig.filter.exclude);
			}

			subscription.filter = filter;

			if (notificationConfig && notificationConfig.notificationsHistory) {
				// const { since, filter } = notificationConfig.notificationsHistory;
				const pastNotifications = await getNotificationHistory();
				addMultipleNotifications(pastNotifications);
			}
			subscription.onNotification = function(notification: INotification) {
				// This function will be called when a notification arrives
				addNotification(notification);
			};

			return NOTIFICATION_CLIENT.subscribe(
				subscription,
				(data: any) => {
					console.log(data);
				},
				(error: any) => {
					console.error(error);
				}
			);
		} catch (error) {
			console.error(error);
		}
	}

	return {
		doAction,
		getWindowSpawnData,
		getNotificationHistory,
		groupNotificationsByType,
		minimizeWindow,
		notifications: state.notifications,
		removeNotification,
		setNotificationDrawerPosition,
		getNotificationConfig,
		toggleComponent
	};
}
