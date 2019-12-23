import {IRouterClient} from "../../types/FSBL-definitions/clients/IRouterClient";

const {RouterClient, Logger} = require("@chartiq/finsemble").Clients;

/**
 * Internal (private) router channels, should not need to be referenced by outside of the Client src
 */
export const ROUTER_ENDPOINTS = {
	NOTIFY: "notify",
	SUBSCRIBE: "subscribe",
	HANDLE_ACTION: "handle_action",
	LAST_ISSUED: "last_issued",
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
 * a component (FSBL.Clients.RouterClient). Also allows for dependency injection to remove Router calls from
 * testing.
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

		if (!router) {
			router = typeof FSBL !== "undefined" ? FSBL.Clients.RouterClient : RouterClient;
		}

		if (!logger) {
			logger = typeof FSBL !== "undefined" ? FSBL.Clients.Logger : Logger;
		}

		this.routerClient = router;
		this.loggerClient = logger;

		this.query = this.query.bind(this);
		this.addResponder = this.addResponder.bind(this);
	}

	/**
	 * @param {string} channel
	 * @param {string} channelPrefix Will use the default prefix if null is passed
	 * @param {any} data
	 * @param {Function} callback
	 */
	public query(channel: string, data: any, channelPrefix?: string, callback?: Function): Promise<any> {
		return new Promise<any>(async (resolve, reject) => {
			try {
				if (channelPrefix == null) {
					channelPrefix = ROUTER_ENDPOINTS.CHANNEL_PREFIX;
				}
				this.loggerClient.log(`Wrapper: sending message on ${channelPrefix + channel} channel`, data);

				let response = await this.routerClient.query(
					channelPrefix + channel,
					data,
					() => {} // Ignoring callback. Use the promise to get the result
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

	/**
	 *
	 * @param {string} channel
	 * @param {Function} dataProcessor
	 * @param {string|null} channelPrefix
	 */
	public addResponder(channel: string, dataProcessor: (notification: any) => any, channelPrefix?: string) {
		if (channelPrefix == null) {
			channelPrefix = ROUTER_ENDPOINTS.CHANNEL_PREFIX;
		}
		this.loggerClient.log(`Wrapper: Adding responder for endpoint: ${channelPrefix + channel}`);

		this.routerClient.addResponder(channelPrefix + channel, (err: any, message: any) => {
			this.loggerClient.log(`Message received on ${channel}: `, message);
			if (err) {
				this.loggerClient.error(`Failed to setup ${channel} responder`, err);
				return;
			}

			try {
				this.loggerClient.log(`Processing message on channel ${channel}: `, message);
				let returnVal = dataProcessor(message.data);
				this.loggerClient.log(`Message response on ${channel}: `, returnVal);
				message.sendQueryResponse(null, {"status": "success", "data": returnVal});
			} catch (err) {
				this.loggerClient.error(`Failed to process query`, err);
				message.sendQueryResponse(err);
			}
		});
	}

	/**
	 *
	 * @param channel
	 * @param channelPrefix
	 * @param payload
	 */
	public transmit(channel: string, payload: any, channelPrefix?: string) {
		if (channelPrefix == null) {
			channelPrefix = ROUTER_ENDPOINTS.CHANNEL_PREFIX;
		}
		this.loggerClient.log(`Transmitting on channel: ${channelPrefix + channel}`);
		this.routerClient.transmit(channelPrefix + channel, payload);
	}

	/**
	 *
	 * @param channel
	 * @param channelPrefix
	 * @param payload
	 */
	public publish(channel: string, payload: any, channelPrefix?: string) {
		if (channelPrefix == null) {
			channelPrefix = ROUTER_ENDPOINTS.CHANNEL_PREFIX;
		}

		this.loggerClient.log(channelPrefix);
		this.loggerClient.log(`Publishing on channel: ${channelPrefix + channel}`);
		this.routerClient.publish(channelPrefix + channel, payload);
	}
}
