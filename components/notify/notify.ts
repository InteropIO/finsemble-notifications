/// <reference types="../../services/FSBL" />

import NotificationClient from "../../services/notification/notificationClient";
import Notification from "../../services/notification/types/Notification";

let nClient: NotificationClient = null;
let launchTutorial = () => {
    let not1 = new Notification();
    not1.headerText = "One notifications";

    let not2 = new Notification();
    not2.headerText = "Notification 2";

    nClient.notify([not1, not2]);
};


if (window.FSBL && FSBL.addEventListener) {
    FSBL.addEventListener('onReady', init);
} else {
    window.addEventListener('FSBLReady', init);
}

function init() {
    document.getElementById('send-notification').addEventListener('click', launchTutorial);
    nClient = new NotificationClient();
}
