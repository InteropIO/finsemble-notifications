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
	not1.headerText = "Internal Actions (No Id)";
	not1.details = "Should create a new notification in UI every time it's sent";
	not1.type = "email";
	not1.headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/email.svg";
	not1.contentLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/graph.png";
	not1.cssClassName = "css-class";

	const dismiss = new Action();
	dismiss.buttonText = "Dismiss";
	dismiss.type = ActionTypes.DISMISS;

	const snooze = new Action();
	snooze.buttonText = "Snooze";
	snooze.type = ActionTypes.SNOOZE;
	snooze.milliseconds = 10000;

	const welcome = new Action();
	welcome.buttonText = "Welcome";
	welcome.type = ActionTypes.SPAWN;
	welcome.component = "Welcome Component";

	not1.actions = [snooze, welcome, dismiss];

	const not2 = new Notification();
	not2.issuedAt = new Date().toISOString();
	not2.id = "notification_123";
	not2.source = source;
	not2.headerText = "Notification Same Id";
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

const sendTestSetNotifications = () => {
	const issuedAt = new Date().toISOString();
	const source = (document.getElementById("feed-source") as HTMLInputElement).value;
	const headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/email.svg";
	const contentLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/graph.png";

	const snooze = new Action();
	snooze.buttonText = "Snooze";
	snooze.type = ActionTypes.SNOOZE;
	snooze.milliseconds = 10000;

	const welcomeLargeText = new Action();
	welcomeLargeText.buttonText = "Spawn Welcome Component";
	welcomeLargeText.type = ActionTypes.SPAWN;
	welcomeLargeText.component = "Welcome Component";

	const publishLargeText = new Action();
	publishLargeText.buttonText = "Publish Action";
	publishLargeText.type = ActionTypes.PUBLISH;
	publishLargeText.channel = "publish-channel";
	publishLargeText.payload = { xyzzy: "moo" };

	const transmitLargeText = new Action();
	transmitLargeText.buttonText = "Transmit Action";
	transmitLargeText.type = ActionTypes.TRANSMIT;
	transmitLargeText.channel = "transmit-channel";
	transmitLargeText.payload = { foo: "bar" };

	const welcome = new Action();
	welcome.buttonText = "Welcome";
	welcome.type = ActionTypes.SPAWN;
	welcome.component = "Welcome Component";

	const publish = new Action();
	publish.buttonText = "Publish";
	publish.type = ActionTypes.PUBLISH;
	publish.channel = "publish-channel";
	publish.payload = { xyzzy: "moo" };

	const transmit = new Action();
	transmit.buttonText = "Transmit";
	transmit.type = ActionTypes.TRANSMIT;
	transmit.channel = "transmit-channel";
	transmit.payload = { foo: "bar" };

	const noMissingValues = new Notification();
	noMissingValues.issuedAt = issuedAt;
	noMissingValues.source = source;
	noMissingValues.type = ActionTypes.DISMISS;
	noMissingValues.title = "Missing No Values";
	noMissingValues.details = "This notification should not be missing any parameters.";
	noMissingValues.headerText = "All Fields Valid";
	noMissingValues.headerLogo = headerLogo;
	noMissingValues.contentLogo = contentLogo;
	noMissingValues.timeout = 600000;
	noMissingValues.cssClassName = "css-class";
	noMissingValues.actions = [publishLargeText, transmitLargeText, welcomeLargeText];

	const missingIssuedAt = new Notification();
	missingIssuedAt.source = source;
	missingIssuedAt.type = ActionTypes.SPAWN;
	missingIssuedAt.title = "Missing Issued At";
	missingIssuedAt.details = "This notification was setup without an issued at date";
	missingIssuedAt.headerText = "No issues at";
	missingIssuedAt.headerLogo = headerLogo;
	missingIssuedAt.contentLogo = contentLogo;
	missingIssuedAt.timeout = 300000;
	missingIssuedAt.cssClassName = "css-class";
	missingIssuedAt.actions = [welcome, publish, transmit];

	const missingAllOptionalFields = new Notification();
	missingAllOptionalFields.issuedAt = issuedAt;

	const missingType = new Notification();
	missingType.issuedAt = new Date().toISOString();
	missingType.source = source;
	missingType.title = "Missing Type";
	missingType.details = "This notification has all optional fields except 'title'";
	missingType.headerText = "No title";
	missingType.headerLogo = headerLogo;
	missingType.contentLogo = contentLogo;
	missingType.timeout = 400000;
	missingType.cssClassName = "css-class";
	missingType.actions = [welcome, publish];

	const missingSource = new Notification();
	missingSource.issuedAt = issuedAt;
	missingSource.type = ActionTypes.SPAWN;
	missingSource.title = "Missing Source";
	missingSource.details = "This notification has all optional fields except 'source'";
	missingSource.headerText = "No source";
	missingSource.headerLogo = headerLogo;
	missingSource.contentLogo = contentLogo;
	missingSource.timeout = 500000;
	missingSource.cssClassName = "css-class";
	missingSource.actions = [welcome, snooze];

	const missingDetails = new Notification();
	missingDetails.issuedAt = issuedAt;
	missingDetails.type = ActionTypes.PUBLISH;
	missingDetails.title = "Missing Details";
	missingDetails.headerText = "No details";
	missingDetails.headerLogo = headerLogo;
	missingDetails.contentLogo = contentLogo;
	missingDetails.timeout = 300000;
	missingDetails.cssClassName = "css-class";
	missingDetails.actions = [welcome, publish, snooze];

	const missingHeaderText = new Notification();
	missingHeaderText.issuedAt = issuedAt;
	missingHeaderText.type = ActionTypes.SPAWN;
	missingHeaderText.title = "Missing Header Text";
	missingHeaderText.details = "This notification has all optional fields except 'details'";
	missingHeaderText.headerLogo = headerLogo;
	missingHeaderText.contentLogo = contentLogo;
	missingHeaderText.timeout = 500000;
	missingHeaderText.cssClassName = "css-class";
	missingHeaderText.actions = [welcome, snooze];

	const missingHeaderLogo = new Notification();
	missingHeaderLogo.issuedAt = issuedAt;
	missingHeaderLogo.type = ActionTypes.DISMISS;
	missingHeaderLogo.title = "Missing Header Logo";
	missingHeaderLogo.details = "This notification has all optional fields except 'headerLogo'";
	missingHeaderLogo.headerText = "No Header Logo";
	missingHeaderLogo.contentLogo = contentLogo;
	missingHeaderLogo.timeout = 500000;
	missingHeaderLogo.cssClassName = "css-class";
	missingHeaderLogo.actions = [welcome, transmit];

	const missingContentLogo = new Notification();
	missingContentLogo.issuedAt = issuedAt;
	missingContentLogo.type = ActionTypes.QUERY;
	missingContentLogo.title = "Missing Content Logo";
	missingContentLogo.details = "This notification has all optional fields except 'contentLogo'";
	missingContentLogo.headerText = "No Content Logo";
	missingContentLogo.headerLogo = headerLogo;
	missingContentLogo.timeout = 300000;
	missingContentLogo.cssClassName = "css-class";
	missingContentLogo.actions = [publish, transmit];

	const missingActions = new Notification();
	missingActions.issuedAt = issuedAt;
	missingActions.type = ActionTypes.TRANSMIT;
	missingActions.title = "Missing Actions";
	missingActions.details = "This notification has all optional fields except 'actions'";
	missingActions.headerText = "No Actions";
	missingActions.headerLogo = headerLogo;
	missingActions.contentLogo = contentLogo;
	missingActions.timeout = 300000;
	missingActions.cssClassName = "css-class";

	const missingTimeout = new Notification();
	missingTimeout.issuedAt = issuedAt;
	missingTimeout.type = ActionTypes.DISMISS;
	missingTimeout.title = "Missing Timeout";
	missingTimeout.details = "This notification has all optional fields except 'timeout'";
	missingTimeout.headerText = "No Timeout";
	missingTimeout.headerLogo = headerLogo;
	missingTimeout.contentLogo = contentLogo;
	missingTimeout.cssClassName = "css-class";
	missingTimeout.actions = [transmit, publish, welcome];

	const missingCssClassName = new Notification();
	missingCssClassName.issuedAt = issuedAt;
	missingCssClassName.type = ActionTypes.PUBLISH;
	missingCssClassName.title = "Missing cssClassName";
	missingCssClassName.details = "This notification has all optional fields except 'cssClassName'";
	missingCssClassName.headerText = "No cssClassName";
	missingCssClassName.headerLogo = headerLogo;
	missingCssClassName.contentLogo = contentLogo;
	missingCssClassName.timeout = 500000;
	missingCssClassName.actions = [welcome, publish, transmit];

	nClient.notify([
		noMissingValues,
		missingIssuedAt,
		missingAllOptionalFields,
		missingType,
		missingSource,
		missingDetails,
		missingHeaderText,
		missingHeaderLogo,
		missingContentLogo,
		missingActions,
		missingTimeout,
		missingCssClassName
	]);
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

		//notifiation custom
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

function init() {
	document.getElementById("send-notification").addEventListener("click", sendNotifications);
	document.getElementById("send-timed").addEventListener("click", timedNotification);
	document.getElementById("get-last-issued").addEventListener("click", getLastIssuedAt);
	document.getElementById("send_test_notifications").addEventListener("click", sendTestSetNotifications);
	nClient = new NotificationClient();
}

if (window.FSBL && (FSBL as any).addEventListener) {
	(FSBL as any).addEventListener("onReady", init);
} else {
	window.addEventListener("FSBLReady", init);
}
