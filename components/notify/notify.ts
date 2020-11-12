/**
 * A manual Notifications source
 */
const sendNotifications = () => {
	const { NotificationClient } = FSBL.Clients;
	const source = (document.getElementById("feed-source") as HTMLInputElement).value;
	const not1 = new NotificationClient.Notification();
	not1.issuedAt = new Date().toISOString();
	not1.source = source;
	not1.headerText = "You've Got Mail";
	not1.title = "Regarding Order...";
	not1.details = "Creates a new notification in UI";
	not1.type = "email";
	not1.headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/email.svg";
	not1.contentLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/graph.png";
	not1.cssClassName = "css-class";
	not1.timeout = 10000;

	const dismiss = new NotificationClient.Action();
	dismiss.buttonText = "Dismiss";
	dismiss.type = NotificationClient.ActionTypes.DISMISS;

	const dismiss2 = new NotificationClient.Action();
	dismiss2.buttonText = "Dismiss";
	dismiss2.type = NotificationClient.ActionTypes.DISMISS;

	const dismiss3 = new NotificationClient.Action();
	dismiss3.buttonText = "Dismiss";
	dismiss3.type = NotificationClient.ActionTypes.DISMISS;

	const snooze = new NotificationClient.Action();
	snooze.buttonText = "Snooze";
	snooze.type = NotificationClient.ActionTypes.SNOOZE;
	snooze.milliseconds = 10000;

	const welcome = new NotificationClient.Action();
	welcome.buttonText = "Launch";
	welcome.type = NotificationClient.ActionTypes.SPAWN;
	welcome.component = "Welcome Component";

	not1.actions = [snooze, welcome, dismiss, dismiss2, dismiss3];

	const not2 = new NotificationClient.Notification();
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
	not2.timeout = 10000;

	const query = new NotificationClient.Action();
	query.buttonText = "Send Query";
	query.type = NotificationClient.ActionTypes.QUERY;
	query.channel = "query-channel";
	query.payload = { hello: "world" };

	const transmit = new NotificationClient.Action();
	transmit.buttonText = "Send Transmit";
	transmit.type = NotificationClient.ActionTypes.TRANSMIT;
	transmit.channel = "transmit-channel";
	transmit.payload = { foo: "bar" };

	const publish = new NotificationClient.Action();
	publish.buttonText = "Send Publish";
	publish.type = NotificationClient.ActionTypes.PUBLISH;
	publish.channel = "publish-channel";
	publish.payload = { xyzzy: "moo" };

	not2.actions = [query, transmit, publish];

	NotificationClient.notify([not1, not2]).then();

	const feedLastIssued = document.getElementById("feed-last-issued");
	if (feedLastIssued) {
		feedLastIssued.innerText = not2.issuedAt;
	}
};

const getLastIssuedAt = () => {
	const { NotificationClient } = FSBL.Clients;
	const source = (document.getElementById("feed-source") as HTMLInputElement).value;

	NotificationClient.getLastIssuedAt(source).then(issuedDate => {
		const serviceLastIssued = document.getElementById("service-last-issued");
		if (serviceLastIssued) {
			serviceLastIssued.innerText = issuedDate;
		}
	});
};

const timedNotification = () => {
	setInterval(() => {
		const { NotificationClient } = FSBL.Clients;
		const source = (document.getElementById("feed-source") as HTMLInputElement).value;

		//notification custom
		const customNot = new NotificationClient.Notification();
		customNot.issuedAt = new Date().toISOString();
		customNot.source = source;
		customNot.headerText = "Custom";
		customNot.details = "This notification is custom...";
		customNot.type = "timed";
		customNot.headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/info.svg";
		customNot.contentLogo =
			"http://localhost:3375/components/finsemble-notifications/components/shared/assets/call-center-agent.svg";
		customNot.cssClassName = "inverted";

		const dismiss = new NotificationClient.Action();
		dismiss.buttonText = "Dismiss";
		dismiss.type = NotificationClient.ActionTypes.DISMISS;

		customNot.actions = [dismiss];

		NotificationClient.notify([customNot]).then();
	}, 20000);
};

const mute = async () => {
	await FSBL.Clients.NotificationClient.mute({ type: "chat" });
};
const unmute = async () => {
	await FSBL.Clients.NotificationClient.unmute({ type: "chat" });
};

function initialize() {
	const { NotificationClient } = FSBL.Clients;
	const n = new NotificationClient.Notification();
	document.getElementById("send-notification")?.addEventListener("click", sendNotifications);
	document.getElementById("send-timed")?.addEventListener("click", timedNotification);
	document.getElementById("get-last-issued")?.addEventListener("click", getLastIssuedAt);
	document.getElementById("mute")?.addEventListener("click", mute);
	document.getElementById("unmute")?.addEventListener("click", unmute);
}

if (window.FSBL && (FSBL as any).addEventListener) {
	(FSBL as any).addEventListener("onReady", initialize);
} else {
	window.addEventListener("FSBLReady", initialize);
}
