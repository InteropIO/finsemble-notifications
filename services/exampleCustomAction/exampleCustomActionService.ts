import NotificationClient, {ROUTER_NAMESPACE} from "../notification/notificationClient";
import INotification from "../../types/Notification-definitions/INotification";

const Finsemble = require("@chartiq/finsemble");

Finsemble.Clients.Logger.start();
Finsemble.Clients.Logger.log("exampleCustomActionService Service starting up");


class exampleCustomActionService extends Finsemble.baseService {
	nClient: NotificationClient;

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

		this.readyHandler = this.readyHandler.bind(this);
		this.changeHeader = this.changeHeader.bind(this);
		this.onBaseServiceReady(this.readyHandler);
	}

	/**
	 * Fired when the service is ready for initialization
	 * @param {function} callback
	 */
	readyHandler() {
		this.nClient = new NotificationClient(
			// Required to pass in the clients when using from a service
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
		Finsemble.Clients.RouterClient.addResponder(
			ROUTER_NAMESPACE.ACTION_PREFIX + 'change-header',
			this.changeHeader);
	}

	private changeHeader(error: any, queryMessage: any): any {
		if (!error) {
			console.log(queryMessage);
			// Tell the notification service the someone is listening
			queryMessage.sendQueryResponse(null, { "response": "..." } );
			let notification = queryMessage.data;
			notification.headerText = "Header Changed";
			this.nClient.notify([notification]);
		}
	}
}

const serviceInstance = new exampleCustomActionService();

serviceInstance.start();
module.exports = serviceInstance;
