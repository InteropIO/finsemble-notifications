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
    action.buttonText = "sdf";

    let filter = new Filter();
    filter.size = {"gte": 30};

    subscription.onNotification = function (notification: INotification) {
        alert(`${FSBL.Clients.WindowClient.getWindowIdentifier().windowName}: ${notification.details}`);
    };

    subscription.filters.push(filter);

    let subscriptionId = nClient.subscribe(subscription,
        (data: any) => {
            console.log(data);
        },
        (error: any) => {
            console.log(error);
        }
    );
}
