import NotificationClient from "../notification/notificationClient";
import RouterWrapper, { ROUTER_ENDPOINTS } from "../helpers/RouterWrapper";
import INotification from "../../types/Notification-definitions/INotification";
import INotificationClient from "../../types/Notification-definitions/INotificationClient";

const Finsemble = require("@chartiq/finsemble");

Finsemble.Clients.Logger.start();
Finsemble.Clients.Logger.log("notificationsBuiltInActions Service starting up");

/**
 * The notification action types this service will deal with.
 * Also the names of the channels expected
 */
const ACTION_TYPES = {
  DISMISS: "dismiss",
  SNOOZE: "snooze",
  WAKE: "wake"
};

/**
 * A service to handle the built notification in actions
 * TODO: Decide and set what log levels all this should be at.
 */
class notificationsBuiltInActionsService extends Finsemble.baseService {
  nClient: INotificationClient;
  private routerWrapper: RouterWrapper;

  /**
   * Initializes a new instance of the notificationsBuiltInActionsService class.
   */
  constructor() {
    super({
      // Declare any service or client dependencies that must be available before your service starts up.
      startupDependencies: {
        // If the service is using another service directly via an event listener or a responder, that service
        // should be listed as a service start up dependency.
        services: [],
        // When ever you use a client API with in the service, it should be listed as a client startup
        // dependency. Any clients listed as a dependency must be initialized at the top of this file for your
        // service to startup.
        clients: []
      }
    });

    this.dismiss = this.dismiss.bind(this);
    this.wake = this.wake.bind(this);
    this.snooze = this.snooze.bind(this);
    this.readyHandler = this.readyHandler.bind(this);

    this.onBaseServiceReady(this.readyHandler);
  }

  /**
   * Fired when the service is ready for initialization
   * @param {function} callback
   */
  readyHandler() {
    this.nClient = new NotificationClient(
      Finsemble.Clients.RouterClient,
      Finsemble.Clients.Logger
    );
    this.routerWrapper = new RouterWrapper(
      Finsemble.Clients.RouterClient,
      Finsemble.Clients.Logger
    );
    this.createRouterEndpoints();
  }

  /**
   * Creates a router endpoint for you service.
   * Add query responders, listeners or pub/sub topic as appropriate.
   */
  createRouterEndpoints() {
    this.routerWrapper.addResponder(
      ROUTER_ENDPOINTS._PREFIX_ACTION + ACTION_TYPES.DISMISS,
      this.dismiss
    );
    // this.routerWrapper.addResponder(ROUTER_ENDPOINTS._PREFIX_ACTION + ACTION_TYPES.SNOOZE, this.snooze);
    // this.routerWrapper.addResponder(ROUTER_ENDPOINTS._PREFIX_ACTION + ACTION_TYPES.WAKE, this.wake);
  }

  /**
   * Dismisses a notification
   *
   * @Note The return value of this function is not the updated notification state.
   * The return value is used to notify the service that there is something that
   * heard the request to process the action
   *
   * @param notification
   *
   */
  private dismiss(notification: INotification): any {
    Finsemble.Clients.Logger.log("Attempting to dismiss", notification);
    // Update notification state and send it out.
    notification.headerText = "Dismissed";
    this.nClient.notify([notification]);
    return true;
  }

  private snooze(notification: INotification): any {}

  private wake(notification: INotification): any {}
}

const serviceInstance = new notificationsBuiltInActionsService();

serviceInstance.start();
module.exports = serviceInstance;
