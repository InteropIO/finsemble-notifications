import INotification from "./INotification";
import IAction from "./IAction";
import ISubscription from "./ISubscription";

export default interface INotificationService {

    /**
     * Creates or updates notifications in Finsemble.
     * @param {INotification[]} notifications from external source to be created or updated in Finsemble.
     */
    notify(notifications: INotification[]): void;

    /**
     * Delete a notification as part of a purge.
     * @param {string} id of a notification
     * @private
     */
    deleteNotification(id: string): void;

    /**
     * Update saveLastUpdated time when incoming notification arrives in Finsemble.
     * @param {string} source a notification that was updated. This notification can then be matched on using a filter to find out when different notifications were last updated.
     * @param {Date} lastUpdated when notification was last delivered to Finsemble.
     * @private
     */
    saveLastUpdatedTime(source: string, lastUpdated: Date): void;

    /**
     * Called in response to a user action VIA a NotificationClient router transmit.
     * @private
     */
    handleAction(notifications: INotification[], action: IAction): void;

    /**
     * When incoming notification arrive, lookup matching subscriptions and call necessary
     * callbacks on subscription.
     * @param {INotification[]} notifications of INotification objects to broadcast.
     * @private
     */
    broadcastNotifications(notifications: INotification[]): void;

    /**
     *
     * @param {ISubscription} subscription
     * @return {string} a router channel on which notifications for this subscription will be sent.
     */
    subscribe(subscription: ISubscription): object;
}
