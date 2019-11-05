import INotification from "./INotification";
import IAction from "./IAction";
import ISubscription from "./ISubscription";

export default interface INotificationService {
    /**
     * Creates or updates notifications in Finsemble.
     * @param {INotification[]} notification from external source to be created or updated in Finsemble.
     */
    notify(notification: INotification[]): void;

    /**
     * Delete a notification as part of a purge.
     * @param {string} id of a notification
     * @private
     */
    deleteNotification(id: string): void;

    /**
     * Update saveLastUpdated time when incoming notification arrives in Finsemble.
     * @param {Date} lastUpdated when notification was last delivered to Finsemble.
     * @param {INotification} notification a notification that was updated. This notification can then be matched on using a filter to find out when different notifications were last updated.
     * @private
     */
    saveLastUpdatedTime(lastUpdated: Date, notification: INotification): void;

    /**
     * Called in response to a user action VIA a NotificationClient router transmit.
     * @private
     */
    handleAction(notification: INotification[], action: IAction): void;

    /**
     * When incoming notification arrive, lookup matching subscriptions and call necessary
     * callbacks on subscription.
     * @param {INotification[]} notification of INotification objects to broadcast.
     * @private
     */
    broadcastNotifications(notification: INotification[]): void;

    /**
     * Array of subscriptions for a particular set of filters.
     * @private
     */
    subscriptions: ISubscription[];
}
