/// <reference types="../../services/FSBL" />

import NotificationClient from "../../services/notification/notificationClient";
import Subscription from "../../services/notification/types/Subscription";
import INotification from "../../services/notification/types/INotification";
import Filter from "../../services/notification/types/Filter";
import Action from "../../services/notification/types/Action";


/**
 * Basic example of a getting a component to subscribe to notifications
 */

let nClient: NotificationClient = null;

if (window.FSBL && FSBL.addEventListener) {
    FSBL.addEventListener('onReady', init);
} else {
    window.addEventListener('FSBLReady', init);
}

function init() {
    nClient = new NotificationClient();
    let subscription = new Subscription();

    let action = new Action();
    action.buttonText = "sdfd";


    let filter = new Filter();
    filter.size = {"gte": 30};
    subscription.filters.push(filter);

    subscription.onNotification = function (notification: INotification) {
        // This function will be called when a notification arrives
        addToList(notification);
    };

    FSBL.Clients.Logger.log("Starting Subscribe");

    let subscriptionId = nClient.subscribe(subscription,
        (data: any) => {
            console.log(data);
        },
        (error: any) => {
            console.log(error);
        }
    );

    // TODO: Unsubscribe using the subscription ID
}

/**
 * Example for setting up button clicks
 *
 * @param notification
 * @param action
 */
let doAction = (notification, action) => {
    try {
        nClient.markActionHandled([notification], action).then(() => {
            // NOTE: The request to perform the action has be sent to the notifications service successfully
            // The action itself has not necessarily been perform successfully
            console.log("success")
        })
    } catch (e) {
        // NOTE: The request to perform the action has failed
        console.log("fail")
    }
};

let addToList = (notification: INotification) => {
    let actions = [];

    notification.actions.forEach((action) => {
        let button = document.createElement('button');
        button.innerText = action.buttonText;
        button.onclick = () => {
            doAction(notification, action);
        };
        actions.push(button);
    });

    let divElement = document.createElement('div');
    divElement.className = 'notification';
    divElement.innerHTML = `<h5>${notification.headerText}</h5>
                            <div class="actions-container"></div>`;

    const actionContainer = divElement.getElementsByClassName('actions-container');
    actions.forEach((action) => {
        actionContainer.item(0).appendChild(action);
    });
    document.getElementById('notification-list').appendChild(divElement);
};
