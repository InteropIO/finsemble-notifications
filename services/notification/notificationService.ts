import INotificationService from "./types/INotificationService";
import INotification from "./types/INotification";
import IAction from "./types/IAction";
import ISubscription from "./types/ISubscription";

const Finsemble = require("@chartiq/finsemble");

Finsemble.Clients.Logger.start();
Finsemble.Clients.Logger.log("notification Service starting up");

// Add and initialize any other clients you need to use (services are initialized by the system, clients are not):
// Finsemble.Clients.AuthenticationClient.initialize();
// Finsemble.Clients.ConfigClient.initialize();
// Finsemble.Clients.DialogManager.initialize();
// Finsemble.Clients.DistributedStoreClient.initialize();
// Finsemble.Clients.DragAndDropClient.initialize();
// Finsemble.Clients.LauncherClient.initialize();
// Finsemble.Clients.LinkerClient.initialize();
// Finsemble.Clients.HotkeyClient.initialize();
// Finsemble.Clients.SearchClient.initialize();
// Finsemble.Clients.StorageClient.initialize();
// Finsemble.Clients.WindowClient.initialize();
// Finsemble.Clients.WorkspaceClient.initialize();

// NOTE: When adding the above clients to a service, be sure to add them to the start up dependencies.

/**
 * TODO: Add service description here
 */
class notificationService extends Finsemble.baseService implements INotificationService {
	/**
	 * Initializes a new instance of the notificationService class.
	 */
	constructor() {
		super({
			// Declare any service or client dependencies that must be available before your service starts up.
			startupDependencies: {
				// If the service is using another service directly via an event listener or a responder, that service
				// should be listed as a service start up dependency.
				services: [
					// "assimilationService",
					// "authenticationService",
					// "configService",
					// "hotkeysService",
					// "loggerService",
					// "linkerService",
					// "searchService",
					// "storageService",
					// "windowService",
					// "workspaceService"
				],
				// When ever you use a client API with in the service, it should be listed as a client startup
				// dependency. Any clients listed as a dependency must be initialized at the top of this file for your
				// service to startup.
				clients: [
					// "authenticationClient",
					// "configClient",
					// "dialogManager",
					// "distributedStoreClient",
					// "dragAndDropClient",
					// "hotkeyClient",
					// "launcherClient",
					// "linkerClient",
					// "searchClient
					// "storageClient",
					// "windowClient",
					// "workspaceClient",
				]
			}
		});

		this.onBaseServiceReady(this.readyHandler);
	}

	/**
	 *
	 * @param {Function} callback
	 */
	readyHandler(callback: Function) {
		serviceInstance.createRouterEndpoints();
		Finsemble.Clients.Logger.log("notification Service ready");
		callback();
	}

	// Implement service functionality
	myFunction(data: any) {
		return `Data passed into query: \n${JSON.stringify(data, null, "\t")}`;
	}

	/**
	 * Creates a router endpoint for you service.
	 * Add query responders, listeners or pub/sub topic as appropriate.
	 */
	createRouterEndpoints() {
		// Add responder for myFunction
		Finsemble.Clients.RouterClient.addResponder("notification.myFunction", (err: any, message: any) => {
			if (err) {
				return Finsemble.Clients.Logger.error("Failed to setup notification.myFunction responder", err);
			}

			Finsemble.Clients.Logger.log('notification Query: ' + JSON.stringify(message));

			try {
				// Data in query message can be passed as parameters to a method in the service.
				const data = this.myFunction(message.data);

				// Send query response to the function call, with optional data, back to the caller.
				message.sendQueryResponse(null, data);
			} catch (e) {
				// If there is an error, send it back to the caller
				message.sendQueryResponse(e);
			}
		});
	}

	subscriptions: ISubscription[];

	broadcastNotifications(notification: INotification[]): void {
	}

	deleteNotification(id: string): void {
	}

	handleAction(notification: INotification[], action: IAction): void {
	}

	notify(notification: INotification[]): void {
	}

	saveLastUpdatedTime(lastUpdated: Date, notification: INotification): void {
	}
}

const serviceInstance = new notificationService();

serviceInstance.start();
module.exports = serviceInstance;
