import {IRouterClient} from "../../types/FSBL-definitions/clients/IRouterClient";

/**
 * Internal (private) router channels, should not need to be referenced by outside of the Client src
 */
export const ROUTER_ENDPOINTS = {
	NOTIFY: "notify",
	SUBSCRIBE: "subscribe",
	HANDLE_ACTION: "handle_action",
	CHANNEL_PREFIX: "notification.",
	ACTION_PREFIX: "action.",
};

/**
 * User for creating custom actions
 */
export const ROUTER_NAMESPACE = {
	ACTION_PREFIX: ROUTER_ENDPOINTS.CHANNEL_PREFIX + ROUTER_ENDPOINTS.ACTION_PREFIX,
};

/**
 * Router wrapper created specifically for notifications to keep the clients and services DRY.
 * Also allows for using the NotificationClient in either a service (Finsemble.Clients.RouterClient) or
 * a component (FSBL.Clients.RouterClient)
 *
 * TODO: Decide and set what log levels all this should be at.
 */
export default class RouterWrapper {
	routerClient: IRouterClient;
	loggerClient: any;

	/**
	 * Constructor
	 *
	 * @param router Needs to be set if using in a service. Defaults to FSBL.Client.RouterClient if none is provided
	 * @param logger Needs to be set if using in a service. Defaults to FSBL.Client.Logger if none is provided
	 */
	constructor(router?: IRouterClient, logger?: any) {
		// Detect if we're in a service or a component.
		if (!router) {
			if (typeof FSBL !== "undefined") {
				router = FSBL.Clients.RouterClient;
			} else if (typeof Finsemble !== "undefined") {
				router = Finsemble.Clients.RouterClient;
			}
		}
		this.routerClient = router;

		if (!logger) {
			if (typeof FSBL !== "undefined") {
				logger = FSBL.Clients.Logger;
			} else if (typeof Finsemble !== "undefined") {
				router = Finsemble.Clients.Logger;
			}
		}
		this.loggerClient = logger;

		this.queryRouter = this.queryRouter.bind(this);
		this.addResponder = this.addResponder.bind(this);
	}

	/**
	 *
	 * @param {string} channel
	 * @param data
	 * @param {Function} callback
	 */
	public queryRouter(channel: string, data: any, callback?: Function): Promise<any> {
		return new Promise<any>(async (resolve, reject) => {
			this.loggerClient.log(`Wrapper: sending message on ${channel} channel`, data);
			try {
				let response = await this.routerClient.query(
					ROUTER_ENDPOINTS.CHANNEL_PREFIX + channel,
					data,
					() => {
					} // Ignore collback. Use promise to get result
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

	public addResponder(channel: string, dataProcessor: (notification: any) => any) {
		this.loggerClient.log(`Wrapper: Adding responder for endpoint: ${channel}`);
		this.routerClient.addResponder(ROUTER_ENDPOINTS.CHANNEL_PREFIX + channel, (err: any, message: any) => {
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
