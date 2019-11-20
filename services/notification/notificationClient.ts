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

    /**
     * @var FSBL.Clients.RouterClient
     */
    private routerClient: any;

    /**
     * @var FSBL.Clients.Logger
     */
    private loggerClient: any;

    constructor() {
        this.setupRouterEndpoints();
        this.setupFSBLDependencies();
    }

    public setRouterClient(client: any) {
        this.routerClient = client;
    }

    public setLoggerClient(client: any) {
        this.loggerClient = client;
    }

    /**
     * @inheritDoc
     */
    fetchHistory(since: Date, filter: IFilter): Promise<INotification[]> {
        return new Promise<INotification[]>((resolve, reject) => {

        });
    }

    /**
     * @inheritDoc
     */
    getLastUpdatedTime(filter?: IFilter): Promise<Date> {
        return new Promise<Date>((resolve, reject) => {

        });
    }

    /**
     * @inheritDoc
     */
    markActionHandled(notification: INotification[], action: IAction): Promise<void> {
        return new Promise<void>((resolve, reject) => {

        });
    }

    /**
     * @inheritDoc
     */
    notify(notifications: any[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.queryRouter(ROUTER_ENDPOINTS.NOTIFY, notifications).then(() => {
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * @inheritDoc
     */
    subscribe(subscription: ISubscription, onSubscriptionSuccess?: Function, onSubscriptionFault?: Function): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                let returnValue = await this.queryRouter(ROUTER_ENDPOINTS.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));
                await this.monitorChannel(returnValue.channel, subscription);
                this.loggerClient.log("Got some return values", returnValue);
                if (onSubscriptionSuccess) {
                    onSubscriptionSuccess(returnValue.channel);
                }
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
     * @inheritDoc
     */
    unsubscribe(subscriptionId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {

        });
    }

    private setupFSBLDependencies(): void {
        if (typeof this.routerClient === "undefined") {
            this.routerClient = FSBL.Clients.RouterClient;
        }

        if (typeof this.loggerClient === "undefined") {
            this.loggerClient = FSBL.Clients.Logger;
        }
    }

    /**
     * Listens on a channel to execute the subscriptions onNofitication callback and send receipt
     *
     * @param {string} channel
     * @param {ISubscription} subscription
     */
    private monitorChannel(channel: string, subscription: ISubscription): Promise<void> {
        return new Promise((resolve) => {
            this.loggerClient.log("Listening on channel", channel);
            this.routerClient.addResponder(channel, (error, queryMessage) => {
                this.loggerClient.log("Found on channel", queryMessage);
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
            this.loggerClient.log(`${channel} called`);
            this.loggerClient.log("Attempting to send", data);
            try {
                let response = await this.routerClient.query(ROUTER_ENDPOINTS.PREFIX + channel, data);
                this.loggerClient.log(`${channel} response: `, response.response.data.data);
                if (callback) {
                    callback(null, response.response.data.data);
                }
                resolve(response.response.data.data);
            } catch (e) {
                this.loggerClient.log(`Error: `, e);
                if (callback) {
                    callback(e);
                }
                reject(e);
            }
        });
    }

    private listenRouter(channel: string, callback: Function) {
        this.routerClient.addListener(channel, callback);
    }
}
