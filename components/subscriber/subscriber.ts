/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { INotification } from "common/notifications/definitions/INotification";
import IAction from "common/notifications/definitions/IAction";

/**
 * Basic example of a getting a component to subscribe to notifications
 */

let subscriptionId: string;

/**
 * Example for setting up button clicks
 *
 * @param notification
 * @param action
 */
const doAction = (notification: INotification, action: IAction) => {
	const { NotificationClient } = FSBL.Clients;
	try {
		NotificationClient.performAction([notification], action).then(() => {
			// NOTE: The request to perform the action has be sent to the notifications service successfully
			// The action itself has not necessarily been perform successfully
			console.log("success");
		});
	} catch (e) {
		// NOTE: The request to perform the action has failed
		console.log("fail");
	}
};

const addToList = (notification: INotification) => {
	const actions: HTMLButtonElement[] = [];

	notification.actions?.forEach(action => {
		const button = document.createElement("button");
		button.innerText = action.buttonText as string;
		button.onclick = () => {
			doAction(notification, action);
		};
		actions.push(button);
	});

	const notificationId = notification.id as string;

	const divElement = document.createElement("div");
	divElement.setAttribute("id", notificationId);
	divElement.className = "notification";
	divElement.innerHTML = `<h5>${notification.headerText}</h5>
                            <div class="actions-container"></div>`;

	if (notification.isSnoozed) {
		divElement.className += " snoozed";
	}

	if (notification.isRead) {
		divElement.className += " dismissed";
	}

	const actionContainer = divElement.getElementsByClassName("actions-container");
	actions.forEach(action => {
		actionContainer.item(0)?.appendChild(action);
	});

	const existingElement = document.getElementById(notificationId);
	if (existingElement) {
		existingElement.replaceWith(divElement);
	} else {
		document.getElementById("notification-list")?.appendChild(divElement);
	}
};

function init() {
	const { NotificationClient } = FSBL.Clients;
	const subscription = new NotificationClient.Subscription();

	// Set the filter to match INotification fields
	subscription.filter = new NotificationClient.Filter();
	// subscription.filter.include.push({"type": "chat"});

	const onNotification = (notification: INotification) => {
		// This function will be called when a notification arrives
		addToList(notification);
	};

	NotificationClient.subscribe(subscription, onNotification).then((subId: string) => {
		subscriptionId = subId;
		console.log(subId);
	});

	(document.getElementById("fetch-from-date") as HTMLInputElement).value = new Date().toISOString();

	document.getElementById("clear-list")?.addEventListener("click", () => {
		const notificationList = document.getElementById("notification-list");
		if (notificationList) {
			notificationList.innerText = "";
		}
	});

	document.getElementById("fetch-history")?.addEventListener("click", () => {
		NotificationClient.fetchHistory((document.getElementById("fetch-from-date") as HTMLInputElement).value).then(
			(notifications: INotification[]) => {
				notifications.forEach(notification => {
					addToList(notification);
				});
			}
		);
	});

	document.getElementById("unsubscribe")?.addEventListener("click", () => {
		try {
			NotificationClient.unsubscribe(subscriptionId).then(() => {
				// Unsubscribed
			});
		} catch (e) {}
	});
}

// @ts-ignore
if (window.FSBL && FSBL.addEventListener) {
	// @ts-ignore
	FSBL.addEventListener("onReady", init);
} else {
	window.addEventListener("FSBLReady", init);
}
