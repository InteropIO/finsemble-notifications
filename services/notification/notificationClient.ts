//Create and export functions which use the router to communicate with your service
import INotificationClient from "../../types/Notification-definitions/INotificationClient";
import INotification from "../../types/Notification-definitions/INotification";
import IFilter from "../../types/Notification-definitions/IFilter";
import IAction from "../../types/Notification-definitions/IAction";
import ISubscription from "../../types/Notification-definitions/ISubscription";
import RouterWrapper, {ROUTER_ENDPOINTS} from "../helpers/RouterWrapper";
import {InternalActions} from "../../types/Notification-definitions/InternalActions";


/**
 * Notification Client
 *
 * Used to send, receive and manipulate notifications
 *
 * TODO: Decide and set what log levels all this should be at.
 */
export default class NotificationClient implements INotificationClient {
	private routerWrapper: RouterWrapper;

	/**
	 * @var FSBL.Clients.Logger
	 */
	private loggerClient: any;

	/**
	 * Constructor
	 * Params are options but need to be set if intending to use in a services
	 *
	 * @param routerClient Needs to be set if using in a service. Defaults to FSBL.Client.RouterClient if none is provided
	 * @param loggerClient Needs to be set if using in a service. Defaults to FSBL.Client.Logger if none is provided
	 */
	constructor(routerClient?: IRouterClient, loggerClient?: ILogger) {
		if (routerClient || loggerClient) {
			this.routerWrapper = new RouterWrapper(routerClient, loggerClient);
			this.loggerClient = loggerClient ? loggerClient : null;
		}
		this.initialize();
	}

	/**
	 * Used by UI components that need to display a list of historical notifications.
	 *
	 * @param {Date} since / time to fetch notifications from.
	 * @param {IFilter} filter to match to notifications.
	 * @returns {INotification[]} array of notifications.
	 * @throws Error
	 * TODO: Implement
	 */
	fetchHistory(since: Date, filter: IFilter): Promise<INotification[]> {
		return new Promise<INotification[]>((resolve, reject) => {
		});
	}

	/**
	 * Return the Date a notification matching the specified filter was updated.
	 *
	 * @param {IFilter} filter to identify which notification to save lastUpdated time for.
	 * @returns last updated Date object.
	 * @throws Error
	 * TODO: Implement
	 */
	getLastUpdatedTime(filter?: IFilter): Promise<Date> {
		return new Promise<Date>((resolve, reject) => {
		});
	}

	/**
	 * Update the notification to mark actions performed.
	 *
	 * @param {INotification[]} notifications Notifications to apply action to.
	 * @param {IAction} action which has been triggered by user.
	 * @throws Error If no error is thrown the service has received the request to perform the action successfully. Note a successful resolution of the promise does not mean successful completion of the action.
	 */
	markActionHandled(notifications: INotification[], action: IAction): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let data = await this.routerWrapper.queryRouter(
					ROUTER_ENDPOINTS.HANDLE_ACTION,
					{
						"notifications": notifications,
						"action": action
					}
				);
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	}

	/**
	 * Creates or updates notifications in Finsemble.
	 *
	 * @param {INotification[]} notifications Array of INotification
	 * @throws Error If no error is thrown the service has received the notifications successfully
	 */
	notify(notifications: any[]): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			try {
				this.routerWrapper.queryRouter(ROUTER_ENDPOINTS.NOTIFY, notifications).then(() => {
					resolve();
				});
			} catch (e) {
				reject(e);
			}
		});
	}

	/**
	 * Subscribe to a notification stream given a set of name/value pair filters. Returns subscriptionId
	 *
	 * @param {ISubscription} subscription with name value pair used to match on.
	 * @param {Function} onSubscriptionSuccess called when subscription is successfully created.
	 * @param {Function} onSubscriptionFault if there is an error creating the subscription.
	 * @throws Error
	 *
	 * TODO: onSubscriptionSuccess and onSubscriptionFault can do a better job of explaining what params will be passed in
	 */
	subscribe(subscription: ISubscription, onSubscriptionSuccess?: Function, onSubscriptionFault?: Function): Promise<string> {
		return new Promise<string>(async (resolve, reject) => {
			try {
				// Get a channel from the service to monitor
				this.loggerClient.log("Attempting to subscribe: ", subscription);
				let returnValue = await this.routerWrapper.queryRouter(ROUTER_ENDPOINTS.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));

				// Monitor the channel and execute subscription.onNotification() for each one that arrives.
				this.loggerClient.log("Got a return value containing a channel", returnValue);
				await this.monitorChannel(returnValue.channel, subscription.onNotification);
				if (onSubscriptionSuccess) {
					onSubscriptionSuccess(returnValue);
				}
				// TODO: Make sure a subscription ID is being returned from the service. This is needed to unsubscribe.
				resolve(returnValue.id);
			} catch (e) {
				if (onSubscriptionFault) {
					onSubscriptionFault(e);
				}
				reject(e)
			}
		});
	}

	/**
	 * Used to unsubscribe to a notification stream.
	 * @param {string} subscriptionId which was returned when subscription was created.
	 * @throws Error
	 * TODO: implement
	 */
	unsubscribe(subscriptionId: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
		});
	}

	private initialize(): void {
		if (typeof this.routerWrapper === "undefined") {
			this.routerWrapper = new RouterWrapper();
		}

		if (typeof this.loggerClient === "undefined") {
			this.loggerClient = FSBL.Clients.Logger;
		}
	}

	/**
	 * Listens on a channel to execute the onNotification callback and sends receipt
	 *
	 * @param channel the channel to listen to.
	 * @param onNotification the action to take when a notification comes though
	 */
	private monitorChannel(channel: string, onNotification: Function): Promise<void> {
		return new Promise((resolve) => {
			this.loggerClient.log("Listening for messages on channel", channel);
			this.routerWrapper.addResponder(channel, (queryMessage) => {
				this.loggerClient.log("Incoming message on channel: ", queryMessage);
				this.loggerClient.log(`Heard message on channel: ${channel}`, queryMessage);

				// Catching user-code errors to allow for successful sending of receipt.
				// TODO: 2nd pair of eyes: Is there situation where this will be confusing to anyone trying to debug an issue
				try {
					onNotification(queryMessage);
				} catch (e) {
					// Error thrown in the onNotification
					this.loggerClient.error(`Error thrown in the onNotification: ${channel}`, queryMessage);
				}

				// Return value used in addResponder as notification received response.
				return {"message": "success"};
			});
			resolve();
		});
	}
}

export {
	InternalActions,
	NotificationClient
};
