/// <reference types="../../services/FSBL" />

import NotificationClient from "../../services/notification/notificationClient";
import Notification from "../../services/notification/types/Notification";

let nClient: NotificationClient = null;
let launchTutorial = () => {
    let not1 = new Notification();
    not1.details = "blub blub";
    nClient.notify([not1]);
};


if (window.FSBL && FSBL.addEventListener) {
    FSBL.addEventListener('onReady', init);
} else {
    window.addEventListener('FSBLReady', init);
}

function init() {
    document.getElementById('send-notification').addEventListener('click', launchTutorial)
    nClient = new NotificationClient();
}
