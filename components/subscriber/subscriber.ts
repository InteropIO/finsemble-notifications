/// <reference types="../../types/FSBL-definitions/globals" />

import NotificationClient from "../../services/notification/notificationClient";
import Subscription from "../../types/Notification-definitions/Subscription";
import INotification from "../../types/Notification-definitions/INotification";
import Filter from "../../types/Notification-definitions/Filter";
import IAction from "../../types/Notification-definitions/IAction";

/**
 * Basic example of a getting a component to subscribe to notifications
 */

let nClient: NotificationClient = null;

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", init);
} else {
	window.addEventListener("FSBLReady", init);
}

let subscriptionId: string = null;

function init() {
	nClient = new NotificationClient();
	let subscription = new Subscription();

	let filter = new Filter();
	filter.size = {gte: 30};
	subscription.filters.push(filter);

	subscription.onNotification = function (notification: INotification) {
		// This function will be called when a notification arrives
		addToList(notification);
	};

	FSBL.Clients.Logger.log("Starting Subscribe");

	nClient.subscribe(
		subscription
	).then((subId) => {
		subscriptionId = subId;
		console.log(subId);
	});

	(<HTMLInputElement>document.getElementById('fetch-from-date')).value = new Date().toISOString();

	document.getElementById('clear-list').addEventListener('click', () => {
		document.getElementById('notification-list').innerText = '';
	});

	document.getElementById('fetch-history').addEventListener('click', () => {
		nClient.fetchHistory((<HTMLInputElement>document.getElementById('fetch-from-date')).value).then((notifications) => {
			notifications.forEach((notification) => {
				addToList(notification);
			})
		});
	});

	document.getElementById('unsubscribe').addEventListener('click', () => {
		try {
			nClient.unsubscribe(subscriptionId).then(() => {
				// Unsubscribed
			});
		} catch (e) {

		}
	});
}

/**
 * Example for setting up button clicks
 *
 * @param notification
 * @param action
 */
let doAction = (notification: INotification, action: IAction) => {
	try {
		nClient.markActionHandled([notification], action).then(() => {
			// NOTE: The request to perform the action has be sent to the notifications service successfully
			// The action itself has not necessarily been perform successfully
			console.log("success");
		});
	} catch (e) {
		// NOTE: The request to perform the action has failed
		console.log("fail");
	}
};

let addToList = (notification: INotification) => {
	let actions: HTMLButtonElement[] = [];

	notification.actions.forEach(action => {
		let button = document.createElement("button");
		button.innerText = action.buttonText;
		button.onclick = () => {
			doAction(notification, action);
		};
		actions.push(button);
	});

	let divElement = document.createElement("div");
	divElement.setAttribute('id', notification.id);
	divElement.className = "notification";
	divElement.innerHTML = `<h5>${notification.headerText}</h5>
                            <div class="actions-container"></div>`;

	if (notification.isSnoozed) {
		divElement.className += ' snoozed';
	}

	if (notification.isActionPerformed) {
		divElement.className += ' dismissed';
	}

	const actionContainer = divElement.getElementsByClassName(
		"actions-container"
	);
	actions.forEach(action => {
		actionContainer.item(0).appendChild(action);
	});

	const existingElement = document.getElementById(notification.id);
	if (existingElement) {
		existingElement.replaceWith(divElement);
	} else {
		document.getElementById("notification-list").appendChild(divElement);
	}

};
