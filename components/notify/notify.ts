import NotificationClient, { ActionTypes } from "../../services/notification/notificationClient";
import Notification from "../../types/Notification-definitions/Notification";
import Action from "../../types/Notification-definitions/Action";

/**
 * A manual Notifications source
 */
let nClient: NotificationClient = null;
const sendNotifications = () => {
	const source = (document.getElementById("feed-source") as HTMLInputElement).value;
	const not1 = new Notification();
	not1.issuedAt = new Date().toISOString();
	not1.source = source;
	not1.headerText = "You've Got Mail";
	not1.title = "Regarding Order...";
	not1.details = "Creates a new notification in UI";
	not1.type = "email";
	not1.headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/email.svg";
	not1.contentLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/graph.png";
	not1.cssClassName = "css-class";

	const dismiss = new Action();
	dismiss.buttonText = "Dismiss";
	dismiss.type = ActionTypes.DISMISS;

	const dismiss2 = new Action();
	dismiss2.buttonText = "Dismiss";
	dismiss2.type = ActionTypes.DISMISS;

	const dismiss3 = new Action();
	dismiss3.buttonText = "Dismiss";
	dismiss3.type = ActionTypes.DISMISS;

	const snooze = new Action();
	snooze.buttonText = "Snooze";
	snooze.type = ActionTypes.SNOOZE;
	snooze.milliseconds = 10000;

	const welcome = new Action();
	welcome.buttonText = "Launch";
	welcome.type = ActionTypes.SPAWN;
	welcome.component = "Welcome Component";

	not1.actions = [snooze, welcome, dismiss, dismiss2, dismiss3];

	const not2 = new Notification();
	not2.issuedAt = new Date().toISOString();
	not2.id = "notification_123";
	not2.source = source;
	not2.headerText = "New chat message";
	not2.title = "Can you join us at 2pm?";
	not2.details = "Should only be in UI once";
	not2.type = "chat";
	not2.headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/chat.svg";
	not2.contentLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/sheild.png";
	not2.cssClassName = "border-red";

	const query = new Action();
	query.buttonText = "Send Query";
	query.type = ActionTypes.QUERY;
	query.channel = "query-channel";
	query.payload = { hello: "world" };

	const transmit = new Action();
	transmit.buttonText = "Send Transmit";
	transmit.type = ActionTypes.TRANSMIT;
	transmit.channel = "transmit-channel";
	transmit.payload = { foo: "bar" };

	const publish = new Action();
	publish.buttonText = "Send Publish";
	publish.type = ActionTypes.PUBLISH;
	publish.channel = "publish-channel";
	publish.payload = { xyzzy: "moo" };

	not2.actions = [query, transmit, publish];

	nClient.notify([not1, not2]);

	document.getElementById("feed-last-issued").innerText = not2.issuedAt;
};

const getLastIssuedAt = () => {
	const source = (document.getElementById("feed-source") as HTMLInputElement).value;

	nClient.getLastIssuedAt(source).then(issuedDate => {
		document.getElementById("service-last-issued").innerText = issuedDate;
	});
};

const timedNotification = () => {
	setInterval(() => {
		const source = (document.getElementById("feed-source") as HTMLInputElement).value;

		//notification custom
		const customNot = new Notification();
		customNot.issuedAt = new Date().toISOString();
		customNot.source = source;
		customNot.headerText = "Custom";
		customNot.details = "This notification is custom...";
		customNot.type = "timed";
		customNot.headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/info.svg";
		customNot.contentLogo =
			"http://localhost:3375/components/finsemble-notifications/components/shared/assets/call-center-agent.svg";
		customNot.cssClassName = "inverted";

		const dismiss = new Action();
		dismiss.buttonText = "Dismiss";
		dismiss.type = ActionTypes.DISMISS;

		customNot.actions = [dismiss];

		nClient.notify([customNot]);
	}, 20000);
};

const mute = async () => {
	await nClient.mute({ type: "chat" });
};
const unmute = async () => {
	await nClient.unmute({ type: "chat" });
};

function init() {
	document.getElementById("send-notification").addEventListener("click", sendNotifications);
	document.getElementById("send-timed").addEventListener("click", timedNotification);
	document.getElementById("get-last-issued").addEventListener("click", getLastIssuedAt);
	document.getElementById("mute").addEventListener("click", mute);
	document.getElementById("unmute").addEventListener("click", unmute);
	nClient = new NotificationClient();
}

if (window.FSBL && (FSBL as any).addEventListener) {
	(FSBL as any).addEventListener("onReady", init);
} else {
	window.addEventListener("FSBLReady", init);
}
