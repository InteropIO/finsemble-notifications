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
        this.queryRouter(ROUTER_ENDPOINTS.NOTIFY, notifications);
    }

    /**
     * @inheritDoc
     */
    subscribe(subscription: ISubscription, onSubscriptionSuccess?: Function, onSubscriptionFault?: Function): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                let returnValue = await this.queryRouter(ROUTER_ENDPOINTS.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));
                await this.monitorChannel(returnValue.channel, subscription);
                FSBL.Clients.Logger.log("Got some return values", returnValue);
                if(onSubscriptionSuccess) {
                    onSubscriptionSuccess(returnValue.channel);
                }
                resolve(returnValue.id);
            } catch (e) {
                if(onSubscriptionFault){
                    onSubscriptionFault(e);
                }
                reject(e)
            }
        });
    }

    /**
     * Listens on a channel to execute the subscriptions onNofitication callback and send receipt
     *
     * @param {string} channel
     * @param {ISubscription} subscription
     */
    private monitorChannel(channel: string, subscription: ISubscription): Promise<void> {
        return new Promise((resolve) => {
            FSBL.Clients.Logger.log("Listening on channel", channel);
            FSBL.Clients.RouterClient.addResponder(channel, (error, queryMessage) => {
                FSBL.Clients.Logger.log("Found on channel", queryMessage);
                try {
                    subscription.onNotification(queryMessage.data);
                    queryMessage.sendQueryResponse(null, {"message": "success"});
                } catch (e) {
                    queryMessage.sendQueryResponse(e);
                }
            });
            resolve();
        });
    }

    /**
     * @inheritDoc
     */
    unsubscribe(subscriptionId: string): void {
    }

    private setupRouterEndpoints() {
    }

    /**
     *
     * @param {string} channel
     * @param data
     * @param {Function} callback
     */
    private queryRouter(channel: string, data: any, callback?: Function): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            FSBL.Clients.Logger.log(`${channel} called`);
            FSBL.Clients.Logger.log("Attempting to send", data);
            try {
                let response = await FSBL.Clients.RouterClient.query(ROUTER_ENDPOINTS.PREFIX + channel, data);
                FSBL.Clients.Logger.log(`${channel} response: `, response.response.data.data);
                if(callback) {
                    callback(null, response.response.data.data);
                }
                resolve(response.response.data.data);
            } catch (e) {
                FSBL.Clients.Logger.log(`Error: `, e);
                if(callback) {
                    callback(e);
                }
                reject(e);
            }
        });
    }

    private listenRouter(channel: string, callback: Function) {
        FSBL.Clients.RouterClient.addListener(channel, callback);
    }
}
