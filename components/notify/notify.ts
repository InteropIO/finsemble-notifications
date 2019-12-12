/// <reference types="../../services/FSBL" />

import NotificationClient, {ActionTypes} from "../../services/notification/notificationClient";
import Notification from "../../types/Notification-definitions/Notification";
import Action from "../../types/Notification-definitions/Action";

/**
 * A manual Notifications source
 */
let nClient: NotificationClient = null;
let launchTutorial = () => {

  let not1 = new Notification();
  not1.id = "notification_" + Math.random();
  not1.headerText = "Internal Actions";
  not1.details = "This is the detail of the notification";

  let dismiss = new Action();
  dismiss.buttonText = "Dismiss";
  dismiss.type = ActionTypes.DISMISS;

  let snooze = new Action();
  snooze.buttonText = "Snooze";
  snooze.type = ActionTypes.SNOOZE;
  snooze.milliseconds = 10000;

  let welcome = new Action();
  welcome.buttonText = "Welcome";
  welcome.type = ActionTypes.SPAWN;
  welcome.component = 'Welcome Component';

  not1.actions = [snooze, welcome, dismiss];


  let not2 = new Notification();
  not2.id = "notification_" + Math.random();
  not2.headerText = "Notification 2";
  not2.details = "This is the detail of the notification";

  let query = new Action();
  query.buttonText = "Send Query";
  query.type = ActionTypes.QUERY;
  query.channel = "query-channel";
  query.payload = { 'hello': 'world' };

  let transmit = new Action();
  transmit.buttonText = "Send Transmit";
  transmit.type = ActionTypes.TRANSMIT;
  transmit.channel = "transmit-channel";
  transmit.payload = { 'foo': 'bar' };

  let publish = new Action();
  publish.buttonText = "Send Publish";
  publish.type = ActionTypes.PUBLISH;
  publish.channel = "publish-channel";
  publish.payload = { 'xyzzy': 'moo' };

  not2.actions = [query, transmit, publish];

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
