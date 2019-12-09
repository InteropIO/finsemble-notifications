import INotificationService from "../../types/Notification-definitions/INotificationService";
import INotification from "../../types/Notification-definitions/INotification";
import IAction from "../../types/Notification-definitions/IAction";
import ISubscription from "../../types/Notification-definitions/ISubscription";
import RouterWrapper, {ROUTER_ENDPOINTS, ROUTER_NAMESPACE} from "../helpers/RouterWrapper";
import PerformedAction from "../../types/Notification-definitions/PerformedAction";
import {InternalActions} from "../../types/Notification-definitions/InternalActions";

const Finsemble = require("@chartiq/finsemble");

Finsemble.Clients.Logger.start();
Finsemble.Clients.Logger.log("notification Service starting up");

/**
 * A service used to transport notification data across the system
 * TODO: Decide and set what log levels all this should be at.
 */
class notificationService extends Finsemble.baseService implements INotificationService {

	/**
	 * TODO: Review the storage of the subscriptions
	 */
	subscriptions: ISubscription[];

	snoozeQueue: {};

	/**
	 * TODO: Store the state of the notifications as per the spec
	 */
	representationOfNotifications: {};
	private routerWrapper: RouterWrapper;

	/**
	 * Initializes a new instance of the notificationService class.
	 */
	constructor() {
		super({
			// Declare any service or client dependencies that must be available before your service starts up.
			startupDependencies: {
				// If the service is using another service directly via an event listener or a responder, that service
				// should be listed as a service start up dependency.
				services: [],
				// When ever you use a client API with in the service, it should be listed as a client startup
				// dependency. Any clients listed as a dependency must be initialized at the top of this file for your
				// service to startup.
				clients: []
			}
		});

		this.snoozeQueue = {};
		this.representationOfNotifications = {};
		this.subscriptions = [];

		this.subscribe = this.subscribe.bind(this);
		this.notify = this.notify.bind(this);
		this.broadcastNotifications = this.broadcastNotifications.bind(this);
		this.readyHandler = this.readyHandler.bind(this);
		this.handleAction = this.handleAction.bind(this);
		this.onBaseServiceReady(this.readyHandler);
	}

	/**
	 *
	 * @param {Function} callback
	 */
	readyHandler(callback: Function) {
		this.routerWrapper = new RouterWrapper(Finsemble.Clients.RouterClient, Finsemble.Clients.Logger);
		this.createRouterEndpoints();
		Finsemble.Clients.Logger.log("notification Service ready");
		callback();
	}

	/**
	 * Setting up the router channels/endpoints
	 */
	createRouterEndpoints() {
		this.setupNotify();
		this.setupSubscribe();
		this.setupAction();
	}

	/**
	 * When incoming notifications arrive, lookup matching subscriptions and call necessary
	 * callbacks on subscription.
	 *
	 * @param {INotification[]} notifications of INotification objects to broadcast.
	 * @private
	 */
	broadcastNotifications(notifications: INotification[]): void {
		this.subscriptions.forEach((subscription) => {
			for (let k in notifications) {
				// Check if this notification matches any filters
				if (this.filtersMatch(subscription, notifications[k])) {
					// For each notification that matches, expect a response and send it out.
					this.expectReceipt(subscription, notifications[k]);
					this.routerWrapper.queryRouter(
						subscription.channel,
						notifications[k],
						(error, response) => {
							this.setReceivedReceipt(subscription, notifications[k], error, response);
						}
					);
				}
			}
		});
	}


	/**
	 * Delete a notification as part of a purge.
	 *
	 * @param {string} id of a notification
	 *
	 * TODO: implement using appropriate storage
	 */
	deleteNotification(id: string): void {
		if (this.representationOfNotifications[id]) {
			delete this.representationOfNotifications[id];
		}
	}

	/**
	 * Handles all messages on the 'action' endpoint/channel and sends them
	 * out to the service that knows how to deal with it.
	 *
	 * @param message
	 */
	handleAction(message): object {
		Finsemble.Clients.Logger.log("Got some actions", message);
		const {notifications, action} = message;
		let response = {
			message: "success",
			errors: []
		};

		notifications.forEach((notification) => {
			try {
				this.delegateAction(notification, action);
			} catch (error) {
				response.message = "fail";
				response.errors.push(error.message);
			}
		});
		return response;
	}

	/**
	 * Creates or updates notifications in Finsemble.
	 *
	 * @param {INotification[]} notifications from external source to be created or updated in Finsemble.
	 */
	notify(notifications: INotification[]): void {
		this.storeNotifications(notifications);
		this.broadcastNotifications(notifications);
	}

	/**
	 * Picks up any messages on the 'subscribe' endpoint/channel
	 *
	 * @param {ISubscription} subscription
	 * @return {string} a router channel on which notifications for this subscription will be sent.
	 */
	subscribe(subscription: ISubscription): object {
		let channel = this.getChannel(subscription);
		// TODO: Set the subscriptionId correctly in accordance with the spec
		subscription.id = "subscription_" + Math.random();
		Finsemble.Clients.Logger.log("Successfully subscription", subscription);
		Finsemble.Clients.Logger.log("Sending channel and subscription Id");
		subscription.channel = channel;

		this.addToSubscription(subscription);
		return {
			"id": subscription.id,
			"channel": channel
		};
	}

	/**
	 * Update saveLastUpdated time when incoming notification arrives in Finsemble.
	 *
	 * @param {Date} lastUpdated when notification was last delivered to Finsemble.
	 * @param {INotification} notification a notification that was updated. This notification can then be matched on using a filter to find out when different notifications were last updated.
	 * @private
	 *
	 * TODO: Implement
	 */
	saveLastUpdatedTime(lastUpdated: Date, notification: INotification): void {
	}

	/**
	 * Delegate the action to any service that is registered on the correct channel
	 *
	 * @see notificationsBuiltInActionsService for an example
	 *
	 * @param notification
	 * @param action
	 *
	 */
	private delegateAction(notification: INotification, action: IAction): void {
		/**
		 * Action is considered completed by the time it hits the service
		 * ie. (the request for action has been received)
		 * Discussion here https://chartiq.slack.com/archives/CPYQ16K7H/p1574357206003200
		 */
		notification = this.setPerformedAction(notification, action);

		/**
		 * If an action is performed on a notification, it should not be snoozed anymore.
		 */
		this.removeFromSnoozeQueue(notification);

		Finsemble.Clients.Logger.log(`Action type: ${action.type}`);
		if (typeof InternalActions[action.type] !== "undefined") {
			Finsemble.Clients.Logger.log(`Is internal action`);

			let updatedNotification = notification;
			// Get the updated state from performing the action
			switch (action.type) {
				case InternalActions.DISMISS:
					updatedNotification = this.dismiss(notification, action);
					break;
				case InternalActions.SNOOZE:
					updatedNotification = this.snooze(notification, action);
					break;
				case InternalActions.SPAWN:
					updatedNotification = this.spawn(notification, action);
					break;
			}

			Finsemble.Clients.Logger.log('Updated notification state', updatedNotification);
			// Send out the new state to all required clients
			this.notify([updatedNotification]);
		} else {
			Finsemble.Clients.Logger.log(`Is External action`);
			/**
			 * TODO/NOTE/DISCUSS:
			 * Need to complete the unhappy path. What happens when there is no responder setup on the action.type channel?
			 * handleAction() is expecting that an error is thrown (if possible) in which case an error, if the code works
			 * correctly, will be sent back to the client.
			 *
			 * If it's ok that the may or may not be an actor waiting at the end of the line. No changes need to be made...
			 * I think.
			 */
			// The request for notification will be sent on action.type as the channel name
			this.routerWrapper.queryRouter(ROUTER_ENDPOINTS.ACTION_PREFIX + action.type, notification);
		}
	}

	/**
	 * Stores the notifications
	 *
	 * @param notifications {INotification[]}
	 */
	private storeNotifications(notifications: INotification[]) {
		notifications.forEach((notification) => {
			if (!notification.id) {
				// Is falsey an appropriate enough check?
				notification.id = this.getId();
			}
			// TODO: Store/Modify the notification appropriately
			this.representationOfNotifications[notification.id] = notification;
		});
	}



	/**
	 * Check if the filters for a subscription match a notification
	 *
	 * @param subscription
	 * @param notification
	 * @return boolean
	 *
	 * TODO: Implement
	 */
	private filtersMatch(subscription: ISubscription, notification: INotification): boolean {
		return true;
	}

	/**
	 * Setup callback on notify channel
	 */
	private setupNotify(): void {
		this.routerWrapper.addResponder(ROUTER_ENDPOINTS.NOTIFY, this.notify);
	}

	/**
	 * Setup callback on subscribe channel
	 */
	private setupSubscribe() {
		this.routerWrapper.addResponder(ROUTER_ENDPOINTS.SUBSCRIBE, this.subscribe);
	}

	/**
	 * Setup callback on action channel
	 */
	private setupAction() {
		this.routerWrapper.addResponder(ROUTER_ENDPOINTS.HANDLE_ACTION, this.handleAction);
	}


	/**
	 * Sets up that we are expecting a receipt for the subscription and notification.
	 *
	 * @param subscription
	 * @param notification
	 *
	 * TODO: Implement.
	 * TODO: Also implement the mechanism that watches for and retries missing receipts
	 */
	private expectReceipt(subscription: ISubscription, notification: INotification) {
		// We're expecting a received receipt on the channel from the client
	}

	/**
	 * Set the receipt status
	 *
	 * @param subscription
	 * @param notification
	 * @param error The error from the Router query
	 * @param response
	 *
	 * TODO: Implement.
	 * @Note I just put all the params in here... not sure what info will be needed
	 */
	private setReceivedReceipt(subscription: ISubscription, notification: INotification, error: string | null, response) {
		Finsemble.Clients.Logger.log(`Got a receipt on: ${subscription.channel}`);
		// We've received a response from the client. Process it and set the correct value
	}

	/**
	 * Store the subscription so it can be referenced and also unsubscribed from later.
	 *
	 * @param subscription
	 *
	 * TODO: Implement
	 */
	private addToSubscription(subscription) {
		this.subscriptions.push(subscription);
	}

	/**
	 * Get a channel/endpoint the client will need to listen to
	 *
	 * @param subscription
	 * @return string
	 *
	 * TODO: Can/should this be improved?
	 */
	private getChannel(subscription: ISubscription): string {
		return ROUTER_ENDPOINTS.SUBSCRIBE + `.${Math.random()}`;
	}

	private snooze(notification: INotification, action: IAction): INotification {
		notification.isActive = false;
		this.snoozeQueue[notification.id] = setTimeout(() => {
			notification.isActive = true;
			this.notify([notification]);
		}, 10000);
		return notification;
	}

	private dismiss(notification: INotification, action: IAction): INotification {
		notification.dismissedAt = new Date();
		notification.isActive = false;
		return notification;
	}

	private spawn(notification: INotification, action: IAction): INotification {
		notification.isActive = false;
		// TODO: spawn component using meta
		return notification;
	}

	/**
	 * Converts an IAction into and IPerformedAction and places it performedActions list
	 *
	 * @param notification
	 * @param action
	 * @return INotification
	 *
	 * @note JavaScript is pass by reference for objects but prefer to be specific by returning a value
	 * not sure if putting a return in is confusing and hinting at it being pass by reference.
	 */
	private setPerformedAction(notification: INotification, action: IAction): INotification {

		const performedAction = new PerformedAction();
		performedAction.id = action.id;
		performedAction.type = action.type;
		performedAction.datePerformed = new Date();
		notification.actionsHistory.push(performedAction);

		return notification;
	}

	/**
	 * Generates a UUID
	 *
	 * TODO: Generate a reliably unique UUID
	 */
	private getId(): string {
		return Math.random().toString();
	}

	private removeFromSnoozeQueue(notification: INotification) {
		if (this.snoozeQueue[notification.id]) {
			clearTimeout(this.snoozeQueue[notification.id]);
		}
	}

}

const serviceInstance = new notificationService();

serviceInstance.start();

export default serviceInstance;
