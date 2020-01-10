/// <reference types="../../types/FSBL-definitions/globals" />

import NotificationClient, {ActionTypes} from "../../services/notification/notificationClient";
import Notification from "../../types/Notification-definitions/Notification";
import Action from "../../types/Notification-definitions/Action";

/**
 * A manual Notifications source
 */
let nClient: NotificationClient = null;
let sendNotifications = () => {
	let source = (<HTMLInputElement>document.getElementById('feed-source')).value;
	let not1 = new Notification();
	not1.issuedAt = new Date().toISOString();
	not1.source = source;
	not1.headerText = "Internal Actions (No Id)";
	not1.details = "Should create a new notification in UI every time it's sent";

	let dismiss = new Action();
	dismiss.buttonText = "Dismiss";
	dismiss.type = ActionTypes.DISMISS;

	let snooze = new Action();
	snooze.buttonText = "Snooze";
	snooze.type = ActionTypes.SNOOZE;
	snooze.milliseconds = 10000;

	let welcome = new Action();
	welcome.buttonText = "Welcome";
	welcome.type = ActionTypes.SPAWN;
	welcome.component = 'Welcome Component';

	not1.actions = [snooze, welcome, dismiss];


	let not2 = new Notification();
	not2.issuedAt = new Date().toISOString();
	not2.id = "notification_123";
	not2.source = source;
	not2.headerText = "Notification Same Id";
	not2.details = "Should only be in UI once";

	let query = new Action();
	query.buttonText = "Send Query";
	query.type = ActionTypes.QUERY;
	query.channel = "query-channel";
	query.payload = {'hello': 'world'};

	let transmit = new Action();
	transmit.buttonText = "Send Transmit";
	transmit.type = ActionTypes.TRANSMIT;
	transmit.channel = "transmit-channel";
	transmit.payload = {'foo': 'bar'};

	let publish = new Action();
	publish.buttonText = "Send Publish";
	publish.type = ActionTypes.PUBLISH;
	publish.channel = "publish-channel";
	publish.payload = {'xyzzy': 'moo'};

	not2.actions = [query, transmit, publish];

	nClient.notify([not1, not2]);

	document.getElementById('feed-last-issued').innerText = not2.issuedAt;
};

let getLastIssuedAt = () => {
	const source = (<HTMLInputElement>document.getElementById('feed-source')).value;

	nClient.getLastIssuedAt(source).then((issuedDate) => {
		document.getElementById('service-last-issued').innerText = issuedDate;
	})
};

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", init);
} else {
	window.addEventListener("FSBLReady", init);
}

function init() {
	document
		.getElementById("send-notification")
		.addEventListener("click", sendNotifications);
	document
		.getElementById("get-last-issued")
		.addEventListener("click", getLastIssuedAt);
	nClient = new NotificationClient();
}
