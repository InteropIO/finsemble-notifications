/// <reference types="../FSBL" />

//Create and export functions which use the router to communicate with your service
import INotificationClient from "./types/INotificationClient";
import INotification from "./types/INotification";
import IFilter from "./types/IFilter";
import IAction from "./types/IAction";
import ISubscription from "./types/ISubscription";

export const ROUTER_ENDPOINTS = {
    PREFIX: "notification.",
    NOTIFY: "notify",
    SUBSCRIBE: "subscribe",
};


export default class NotificationClient implements INotificationClient {

    constructor() {
        this.setupRouterEndpoints();
    }


    /**
     * @inheritDoc
     */
    fetchHistory(since: Date, filter: IFilter): INotification[] {
        return [];
    }

    /**
     * @inheritDoc
     */
    getLastUpdatedTime(filter?: IFilter): Date {
        return undefined;
    }

    /**
     * @inheritDoc
     */
    markActionHandled(notification: INotification[], action: IAction): void {
    }

    /**
     * @inheritDoc
     */
    notify(notifications: any[]): void {
        this.callRouter(ROUTER_ENDPOINTS.NOTIFY, notifications, (error: any, data: any) => {

        });
    }

    /**
     * @inheritDoc
     */
    subscribe(subscription: ISubscription, onSubscriptionSuccess: Function, onSubscriptionFault: Function): string {
        this.callRouter(ROUTER_ENDPOINTS.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)), (error, data) => {
            if (error) {
                onSubscriptionFault(error);
            } else {
                FSBL.Clients.Logger.log("Subscribed successfully. Got back", data);
                // We should get back a channel from the service. Make sure the subscriptions's onNotify is called for notifications on this channel
                onSubscriptionSuccess(data);
            }
        });
        return "";
    }

    /**
     * @inheritDoc
     */
    unsubscribe(subscriptionId: string): void {
    }

    private setupRouterEndpoints() {
    }

    private callRouter(channel: string, data: any, callback: Function) {
        FSBL.Clients.Logger.log(`${channel} called`);
        FSBL.Clients.Logger.log("Attempting to send", data);
        FSBL.Clients.RouterClient.query(ROUTER_ENDPOINTS.PREFIX + channel, data, function (error: any, response: any) {
            FSBL.Clients.Logger.log(`${channel} response: `, response.data);
            if (callback) {
                callback(error, response.data);
            }
        });
    }
}
