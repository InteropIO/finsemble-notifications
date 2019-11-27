
export const ROUTER_ENDPOINTS = {
    NOTIFY: "notify",
    SUBSCRIBE: "subscribe",
    HANDLE_ACTION: "handle_action",
    _PREFIX_ACTION: "action."
};

const CHANNEL_PREFIX: String = "notification.";


export default class RouterWrapper {
    routerClient: IRouterClient;
    loggerClient: any;

    constructor(router?: IRouterClient, logger?: any) {
        if(!router) {
            router = FSBL.Clients.RouterClient;
        }
        this.routerClient = router;

        if(!logger) {
            logger = FSBL.Clients.Logger;
        }
        this.loggerClient = logger;

        this.queryRouter = this.queryRouter.bind(this);
        this.listenRouter = this.listenRouter.bind(this);
        this.addResponder = this.addResponder.bind(this);
    }

    /**
     *
     * @param {string} channel
     * @param data
     * @param {Function} callback
     */
    public queryRouter(channel: String, data: any, callback?: Function): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.loggerClient.log(`Wrapper: sending message on ${channel} channel`, data);
            try {
                let response = await this.routerClient.query(
                    CHANNEL_PREFIX.toString() + channel,
                    data,
                    () => {}
                );
                this.loggerClient.log(`${channel} raw response: `, response);
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

    public listenRouter(channel: string, callback: StandardCallback) {
        this.routerClient.addListener(CHANNEL_PREFIX + channel, (error, response) => {
            this.loggerClient.log(`Message received on ${channel}: `, response);
            callback(error, response);
        });
    }

    public addResponder(channel: string, dataProcessor: (notification: any) => any) {
        this.loggerClient.log(`Wrapper: Adding responder for endpoint: ${channel}`);
        this.routerClient.addResponder(CHANNEL_PREFIX + channel, (err: any, message: any) => {
            this.loggerClient.log(`Message received on ${channel}: `, message);
            if (err) {
                this.loggerClient.error(`Failed to setup ${channel} responder`, err);
                return;
            }

            try {
                this.loggerClient.log(`Processing messgae ${channel}: `, message);
                let returnVal = dataProcessor(message.data);
                message.sendQueryResponse(null, {"status": "success", "data": returnVal});
            } catch (err) {
                this.loggerClient.error(`Failed to process query`, err);
                message.sendQueryResponse(err);
            }
        });
    }
}

