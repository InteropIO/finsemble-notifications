/// <reference types="../../services/FSBL" />

import NotificationClient from "../../services/notification/notificationClient";
import Subscription from "../../services/notification/types/Subscription";
import INotification from "../../services/notification/types/INotification";
import Filter from "../../services/notification/types/Filter";
import Action from "../../services/notification/types/Action";

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

    subscription.onNotification = function (notification: INotification) {
        addToList(notification);
    };

    subscription.filters.push(filter);

    FSBL.Clients.Logger.log("Starting Subscribe");

    let subscriptionId = nClient.subscribe(subscription,
        (data: any) => {
            console.log(data);
        },
        (error: any) => {
            console.log(error);
        }
    );
}

let doAction = (notification, action) => {
    try {
        nClient.markActionHandled([notification], action).then(() => {
            console.log("success")
        })
    } catch (e) {
        console.log("fail")
    }
    console.log(notification, action);
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
