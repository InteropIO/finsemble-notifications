/// <reference types="../../services/FSBL" />

import NotificationClient from "../../services/notification/notificationClient";
import Notification from "../../types/Notification-definitions/Notification";
import IAction from "../../types/Notification-definitions/IAction";
import Action from "../../types/Notification-definitions/Action";

/**
 * A manualNotifications source
 */
let nClient: NotificationClient = null;
let launchTutorial = () => {
  let dismiss = new Action();
  dismiss.id = "action_" + Math.random();
  dismiss.buttonText = "Dismiss";
  dismiss.type = "DISMISS";

  let snooze = new Action();
  snooze.id = "action_" + Math.random();
  snooze.buttonText = "Snooze";
  snooze.type = "SNOOZE";

  let changeHeader = new Action();
  changeHeader.id = "action_" + Math.random();
  changeHeader.buttonText = "Change header";
  changeHeader.type = "change-header";

  let actionList: IAction[] = [snooze, dismiss, changeHeader];

  let not1 = new Notification();
  not1.id = "notification_" + Math.random();
  not1.headerText = "One notifications";
  not1.actions = actionList;
  not1.details = "This is the detail of the notification";

  let not2 = new Notification();
  not2.id = "notification_" + Math.random();
  not2.headerText = "Notification 2";
  not2.actions = actionList;
  not2.details = "This is the detail of the notification";

  nClient.notify([not1, not2]);
};

if (window.FSBL && FSBL.addEventListener) {
  FSBL.addEventListener("onReady", init);
} else {
  window.addEventListener("FSBLReady", init);
}

function init() {
  document
    .getElementById("send-notification")
    .addEventListener("click", launchTutorial);
  nClient = new NotificationClient();
}
