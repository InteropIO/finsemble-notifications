/// <reference types="../../services/FSBL" />

import NotificationClient from "../../services/notification/notificationClient";

let nClient: NotificationClient = null;
let launchTutorial = () => {
    nClient.notify([{"message": "hi"}]);
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
