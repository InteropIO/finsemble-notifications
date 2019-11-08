/// <reference types="../../services/FSBL" />

import NotificationClient from "../../services/notification/notificationClient";
import Subscription from "../../services/notification/types/Subscription";
import INotification from "../../services/notification/types/INotification";
import Filter from "../../services/notification/types/Filter";

let nClient: NotificationClient = null;


if (window.FSBL && FSBL.addEventListener) {
    FSBL.addEventListener('onReady', init);
} else {
    window.addEventListener('FSBLReady', init);
}

function init() {
    nClient = new NotificationClient();
    let subscription = new Subscription();

    let filter = new Filter();
    filter.size = {"gte": 30};

    subscription.onNotification = function (notification: INotification) {
        alert("I got notified");
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
