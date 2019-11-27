import IFilter from "./IFilter";
import INotification from "./INotification";
import IAction from "./IAction";
import ISubscription from "./ISubscription";

export default interface INotificationClient {
    /**
     * Subscribe to a notification stream given a set of name/value pair filters. Returns subscriptionId
     * @param {ISubscription} subscription with name value pair used to match on.
     * @param {Function} onSubscriptionSuccess called when subscription is successfully created.
     * @param {Function} onSubscriptionFault if there is an error creating the subscription.
     */
    subscribe(subscription: ISubscription, onSubscriptionSuccess: Function, onSubscriptionFault: Function): Promise<string>;

    /**
     * Used to unsubscribe to a notification stream.
     * @param {string} subscriptionId which was returned when subscription was created.
     */
    unsubscribe(subscriptionId: string): Promise<void>;

    /**
     * Return the Date a notification matching the specified filter was updated.
     * @param {IFilter} filter to identify which notification to save lastUpdated time for.
     * @returns last updated Date object.
     */
    getLastUpdatedTime(filter?: IFilter): Promise<Date>;

    /**
     * Used by UI components that need to display a list of historical notifications.
     * @param {Date} since / time to fetch notifications from.
     * @param {IFilter} filter to match to notifications.
     * @returns {INotification[]} array of notifications.
     */
    fetchHistory(since: Date, filter: IFilter): Promise<INotification[]>;

    /**
     * Creates or updates notifications in Finsemble.
     * @param {INotification[]} notifications Array of INotification
     */
    notify(notifications: INotification[]): Promise<void>;

    /**
     * Update the notification to mark actions performed.
     * @param {INotification[]} notifications Notifications to apply action to.
     * @param {IAction} action which has been triggered by user.
     */
    markActionHandled(notifications: INotification[], action: IAction): Promise<void>;
}
