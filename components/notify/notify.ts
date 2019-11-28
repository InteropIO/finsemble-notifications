/// <reference types="../../services/FSBL" />

import NotificationClient from "../../services/notification/notificationClient";
import Notification from "../../services/notification/types/Notification";
import IAction from "../../services/notification/types/IAction";
import Action from "../../services/notification/types/Action";


/**
 * A manualNotifications source
 */
let nClient: NotificationClient = null;
let launchTutorial = () => {

    let dismiss = new Action();
    dismiss.id = "action_" + Math.random();
    dismiss.buttonText = "Dismiss";
    dismiss.type = "dismiss";

    let snooze = new Action();
    snooze.id = "action_" + Math.random();
    snooze.buttonText = "Snooze";
    snooze.type = "snooze";

    let actionList: IAction[] = [snooze, dismiss];

    let not1 = new Notification();
    not1.id = 'notification_' + Math.random();
    not1.headerText = "One notifications";
    not1.actions = actionList;

    let not2 = new Notification();
    not2.id = 'notification_' + Math.random();
    not2.headerText = "Notification 2";
    not2.actions = actionList;

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
