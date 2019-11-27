//Create and export functions which use the router to communicate with your service
import INotificationClient from "./types/INotificationClient";
import INotification from "./types/INotification";
import IFilter from "./types/IFilter";
import IAction from "./types/IAction";
import ISubscription from "./types/ISubscription";
import RouterWrapper, {ROUTER_ENDPOINTS} from "../helpers/RouterWrapper";



export default class NotificationClient implements INotificationClient {

    private routerWrapper: RouterWrapper;

    /**
     * @var FSBL.Clients.Logger
     */
    private loggerClient: any;

    constructor(routerClient? :IRouterClient, loggerClient?: ILogger) {
        if(routerClient || loggerClient) {
            this.routerWrapper = new RouterWrapper(routerClient, loggerClient);
            this.loggerClient = loggerClient ? loggerClient : null;
        }
        this.initialize();
    }

    public setRouterWrapper(wrapper: RouterWrapper) {
        this.routerWrapper = wrapper;
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
     * @inheritDoc
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
     * @inheritDoc
     */
    subscribe(subscription: ISubscription, onSubscriptionSuccess?: Function, onSubscriptionFault?: Function): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            try {
                this.loggerClient.log("Attempting to subscribe: ", subscription);
                let returnValue = await this.routerWrapper.queryRouter(ROUTER_ENDPOINTS.SUBSCRIBE, JSON.parse(JSON.stringify(subscription)));
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

    private initialize(): void {
        if (typeof this.routerWrapper === "undefined") {
            this.routerWrapper = new RouterWrapper();
        }

        if (typeof this.loggerClient === "undefined") {
            this.loggerClient = FSBL.Clients.Logger;
        }
    }

    /**
     * Listens on a channel to execute the subscriptions onNotification callback and send receipt
     *
     * @param {string} channel
     * @param {ISubscription} subscription
     */
    private monitorChannel(channel: string, subscription: ISubscription): Promise<void> {
        return new Promise((resolve) => {
            this.loggerClient.log("Listening for messages on channel", channel);
            this.routerWrapper.addResponder(channel, (queryMessage) => {
                this.loggerClient.log("Incoming message on channel: ", queryMessage);
                this.loggerClient.log(`Heard message on channel: ${channel}`, queryMessage);
                // Message received - send receipt
                subscription.onNotification(queryMessage);
                return {"message": "success"};
            });
            resolve();
        });
    }
}
