import INotificationClient from "../../types/Notification-definitions/INotificationClient";
import INotification from "../../types/Notification-definitions/INotification";
import IFilter from "../../types/Notification-definitions/IFilter";
import IAction from "../../types/Notification-definitions/IAction";
import ISubscription from "../../types/Notification-definitions/ISubscription";
import RouterWrapper, {
  ROUTER_ENDPOINTS,
  ROUTER_NAMESPACE
} from "../helpers/RouterWrapper";
import { ActionTypes } from "../../types/Notification-definitions/ActionTypes";
import { IRouterClient } from "../../types/FSBL-definitions/clients/IRouterClient";
import { ILogger } from "../../types/FSBL-definitions/clients/logger.interface";

const { Logger } = require("@chartiq/finsemble").Clients;

/**
 * Notification Client
 *
 * Used to send, receive and manipulate notifications
 *
 * TODO: Decide and set what log levels all this should be at.
 */
export default class NotificationClient implements INotificationClient {
  private routerWrapper: RouterWrapper;

  /**
   * @var FSBL.Clients.Logger
   */
  private loggerClient: any;

  /**
   * Constructor
   * Params are options but need to be set if intending to use in a services
   *
   * @param routerClient Needs to be set if using in a service. Defaults to FSBL.Client.RouterClient if none is provided
   * @param loggerClient Needs to be set if using in a service. Defaults to FSBL.Client.Logger if none is provided
   */
  constructor(routerClient?: IRouterClient, loggerClient?: ILogger) {
    if (routerClient || loggerClient) {
      this.routerWrapper = new RouterWrapper(routerClient, loggerClient);
      this.loggerClient = loggerClient ? loggerClient : null;
    } else {
      this.routerWrapper = new RouterWrapper();
    }

    if (!this.loggerClient) {
      this.loggerClient =
        typeof FSBL !== "undefined" ? FSBL.Clients.Logger : Logger;
    }
  }

  /**
   * Used by UI components that need to display a list of historical notifications.
   *
   * @param {string} since ISO8601 formatted string to fetch notifications from.
   * @param {IFilter} filter to match to notifications.
   * @returns {INotification[]} array of notifications.
   * @throws Error
   * TODO: Implement
   */
  fetchHistory(since: string, filter: IFilter): Promise<INotification[]> {
    return new Promise<INotification[]>(async (resolve, reject) => {
      try {
        const data = await this.routerWrapper.query(
          ROUTER_ENDPOINTS.FETCH_HISTORY,
          {
            since: since,
            filter: filter
          }
        );
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Return an ISO8601 date a notification matching the specified source was issued.
   *
   * @param {string} source to identify which notification to save lastUpdated time for.
   * @returns last issued at date string in the ISO8601 date format.
   * @throws Error
   * TODO: Implement
   */
  getLastIssuedAt(source?: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const data = await this.routerWrapper.query(
          ROUTER_ENDPOINTS.LAST_ISSUED,
          source
        );
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Update the notification to mark actions performed.
   *
   * @param {INotification[]} notifications Notifications to apply action to.
   * @param {IAction} action which has been triggered by user.
   * @throws Error If no error is thrown the service has received the request to perform the action successfully. Note a successful resolution of the promise does not mean successful completion of the action.
   */
  markActionHandled(
    notifications: INotification[],
    action: IAction
  ): Promise<void> {
    // I think this is a clumsy interface. The default case will likely be a single notification.
    // No need to punish the developer
    if (!Array.isArray(notifications)) {
      notifications = [notifications];
    }

    return new Promise<void>(async (resolve, reject) => {
      try {
        const data = await this.routerWrapper.query(
          ROUTER_ENDPOINTS.HANDLE_ACTION,
          {
            notifications: notifications,
            action: action
          }
        );
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Creates or updates notifications in Finsemble.
   *
   * @param {INotification[]} notifications Array of INotification
   * @throws Error If no error is thrown the service has received the notifications successfully
   */
  notify(notifications: any[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.routerWrapper
          .query(ROUTER_ENDPOINTS.NOTIFY, notifications)
          .then(() => {
            resolve();
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Subscribe to a notification stream given a set of name/value pair filters. Returns subscriptionId
   *
   * @param {ISubscription} subscription with name value pair used to match on.
   * @param {Function} onSubscriptionSuccess called when subscription is successfully created.
   * @param {Function} onSubscriptionFault if there is an error creating the subscription.
   * @throws Error
   *
   * TODO: onSubscriptionSuccess and onSubscriptionFault can do a better job of explaining what params will be passed in
   */
  subscribe(
    subscription: ISubscription,
    onSubscriptionSuccess?: Function,
    onSubscriptionFault?: Function
  ): Promise<string> {
    this.loggerClient.log("Attempting to subscribe: ", subscription);
    return new Promise<string>(async (resolve, reject) => {
      try {
        // Get a channel from the service to monitor
        this.loggerClient.log("Attempting to subscribe: ", subscription);
        const returnValue = await this.routerWrapper.query(
          ROUTER_ENDPOINTS.SUBSCRIBE,
          JSON.parse(JSON.stringify(subscription)) // ISubscription has a callback that can't be sent across the router
        );

        // Monitor the channel and execute subscription.onNotification() for each one that arrives.
        this.loggerClient.log(
          "Got a return value containing a channel",
          returnValue
        );
        await this.monitorChannel(
          returnValue.channel,
          subscription.onNotification
        );
        if (onSubscriptionSuccess) {
          onSubscriptionSuccess(returnValue);
        }
        resolve(returnValue.id);
      } catch (e) {
        if (onSubscriptionFault) {
          onSubscriptionFault(e);
        }
        reject(e);
      }
    });
  }

  /**
   * Used to unsubscribe to a notification stream.
   * @param {string} subscriptionId which was returned when subscription was created.
   * @throws Error
   * TODO: implement
   */
  unsubscribe(subscriptionId: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.routerWrapper.query(
          ROUTER_ENDPOINTS.UNSUBSCRIBE,
          subscriptionId
        );
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Listens on a channel to execute the onNotification callback and sends receipt
   *
   * @param channel the channel to listen to.
   * @param onNotification the action to take when a notification comes though
   */
  private monitorChannel(
    channel: string,
    onNotification: Function
  ): Promise<void> {
    return new Promise(resolve => {
      this.loggerClient.log("Listening for messages on channel", channel);
      this.routerWrapper.addResponder(channel, queryMessage => {
        this.loggerClient.log("Incoming message on channel: ", queryMessage);
        this.loggerClient.log(
          `Heard message on channel: ${channel}`,
          queryMessage
        );

        // Catching user-code errors to allow for successful sending of receipt.
        // TODO: 2nd pair of eyes: Is there situation where this will be confusing to anyone trying to debug an issue
        try {
          onNotification(queryMessage);
        } catch (e) {
          // Error thrown in the onNotification
          this.loggerClient.error(
            `Error thrown in the subscription.onNotification()`,
            e
          );
        }

        // Return value used in addResponder as notification received response.
        return { message: "success" };
      });
      resolve();
    });
  }
}

export { ActionTypes, NotificationClient, ROUTER_NAMESPACE };
