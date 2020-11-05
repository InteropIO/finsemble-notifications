import * as React from "react";
import { INotification } from "common/notifications/definitions/INotification";
import WindowConfig, { NotificationsConfig } from "../../../types/Notification-definitions/NotificationConfig";
import IFilter from "common/notifications/definitions/IFilter";
import { NotificationGroupList } from "../../../types/Notification-definitions/NotificationHookTypes";
import IMuteFilter from "common/notifications/definitions/IMuteFilter";

const { useReducer, useEffect } = React;

const { WindowClient } = FSBL.Clients;

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
				: [action.payload, ...state.notifications];

			return { notifications };
		case REMOVE:
			return {
				notifications: state.notifications.filter(notification => notification.id !== action.payload.id)
			};
		default:
			throw new Error();
	}
}

export default function useNotifications(params: any = {}) {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { NotificationClient } = FSBL.Clients;

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

	/**
	 * Example for setting up button clicks
	 *
	 * @param notification
	 * @param action
	 */
	function doAction(notification: INotification, action: any) {
		try {
			NotificationClient.performAction([notification], action).then(() => {
				// NOTE: The request to perform the action has be sent to the notifications service successfully
				// The action itself has not necessarily been perform successfully
				// 1) alert user notification has been sent (action may not have completed)
			});
		} catch (e) {
			// NOTE: The request to perform the action has failed
			console.error("could not create a notification client", e);
			FSBL.Clients.Logger.error("could not create a notification client", e);
		}
	}

	/**
	 * Example for setting up button clicks
	 *
	 * @param filter
	 */
	async function mute(filter: IMuteFilter) {
		try {
			await NotificationClient.mute(filter);
		} catch (e) {
			// NOTE: The request to perform the action has failed
			console.error("Could not save mute preferences", e);
			FSBL.Clients.Logger.error("Could not save mute preferences", e);
		}
	}

	/**
	 * Example for setting up button clicks
	 *
	 * @param filter
	 */
	async function unmute(filter: IMuteFilter) {
		try {
			await NotificationClient.unmute(filter);
		} catch (e) {
			// NOTE: The request to perform the action has failed
			console.error("Could not save mute preferences", e);
			FSBL.Clients.Logger.error("Could not save mute preferences", e);
		}
	}

	/**
	 * Marks a notification as read
	 *
	 * @param {INotification[]} notifications
	 */
	function markNotificationsUnread(notifications: INotification[]) {
		try {
			NotificationClient.markUnread(notifications).then(() => {
				// NOTE: The request to perform the action has be sent to the notifications service successfully
				// The action itself has not necessarily been perform successfully
			});
		} catch (e) {
			console.error("Error marking messages as unread", e);
			FSBL.Clients.Logger.error("Could not mark notification as unread", e);
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
					(notification: INotification): string =>
						//@ts-ignore
						notification[type]
				)
				.reduce((acc: { [x: string]: any }, notificationType: string, index: number) => {
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
		return NotificationClient.fetchHistory(since, filter as IFilter);
	};

	/**
	 * Get Notification's config from
	 */
	const getNotificationConfig = (): NotificationsConfig => {
		const config: WindowConfig = WindowClient.options.customData;

		return Object.assign(config?.window?.data?.notifications || {}, {
			isTransparent: config?.window?.options?.transparent || false
		});
	};

	const notificationIsActive = (notification: INotification) => {
		const config = getNotificationConfig();
		const applyMuteFilters = config?.applyMuteFilters ? config.applyMuteFilters : false;

		return (
			!notification.isSnoozed &&
			!notification.isRead &&
			!notification.isDeleted &&
			(applyMuteFilters ? !notification.isMuted : true)
		);
	};

	const activeNotifications = (notifications: INotification[]) =>
		notifications.filter(notification => notificationIsActive(notification));

	/**
	 * Main init function to start the subscription
	 */
	async function init() {
		try {
			const subscription = new NotificationClient.Subscription();

			const notificationConfig: NotificationsConfig = getNotificationConfig();

			const filter: IFilter = new NotificationClient.Filter();

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

			if ((notificationConfig && notificationConfig.notificationsHistory) || params?.config?.notificationsHistory) {
				// const { since, filter } = notificationConfig.notificationsHistory;
				const pastNotifications = await getNotificationHistory();
				addMultipleNotifications(pastNotifications);
			}
			const onNotification = function(notification: INotification) {
				// This function will be called when a notification arrives
				if (notification.isDeleted) {
					removeNotification(notification);
				} else {
					addNotification(notification);
				}
			};

			return NotificationClient.subscribe(subscription, onNotification);
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Set opaque class to html element
	 */
	function setOpaqueClassName(isOpaque: boolean) {
		if (isOpaque) {
			const htmlElement = document.getElementsByTagName("html")[0];
			if (!htmlElement.className.includes("opaque")) {
				htmlElement.className += " opaque";
			}
		}
	}

	// start receiving Notifications and putting them in state
	useEffect(() => {
		const subscribe = init();
		return () => {
			// Unsubscribe using the subscription ID
			(async () => {
				await NotificationClient.unsubscribe((await subscribe) as string);
			})();
		};
	}, []);

	return {
		activeNotifications,
		notificationIsActive,
		doAction,
		markNotificationsUnread,
		mute,
		unmute,
		getNotificationHistory,
		groupNotificationsByType,
		notifications: state.notifications,
		removeNotification,
		setOpaqueClassName,
		getNotificationConfig
	};
}
