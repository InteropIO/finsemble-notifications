/// <reference types="../FSBL" />

//Create and export functions which use the router to communicate with your service
import INotificationClient from "./types/INotificationClient";
import INotification from "./types/INotification";
import IFilter from "./types/IFilter";
import IAction from "./types/IAction";


class NotificationClient implements INotificationClient {
    broadcastNotifications(notification: INotification[]): void {
    }

    fetchHistory(since: Date, filter: IFilter): INotification[] {
        return [];
    }

    getLastUpdatedTime(filter?: IFilter): Date {
        return undefined;
    }

    markActionHandled(notification: INotification[], action: IAction): void {
    }

    notify(notification: INotification[]): void {
    }

    subscribe(filter: IFilter, onNotification: Function, onSubscriptionSuccess: Function, onSubscriptionFault: Function): string {
        return "";
    }

    unsubscribe(subscriptionId: string): void {
    }

}

export function myFunction(cb: Function) {
    FSBL.Clients.Logger.log("notification.myFunction called");
    FSBL.Clients.RouterClient.query("notification functions", { query: "myFunction" }, function (err: any, response: any) {
        FSBL.Clients.Logger.log("notification.myFunction response: ", response.data);
        if (cb) {
            cb(err, response.data);
        }
    });
}

// Exported functions can be imported into your components as follows:
// import {myFunction} from '../../services/notification/notificationClient';

// Doing so allows service functions to be used as if they were local, e.g.:
// myFunction(function(err, response) {
//     if (err) {
//         Logger.error("Failed to call myFunction!", err);
//     } else {
//         Logger.log("called myFunction: ", response);
//     }
// });

// alternatively import the entire class of functions:
// import * as serviceClient from '../../services/notification/notificationClient'
// serviceClient.myFunction(function(err, response) {
//     if (err) {
//         Logger.error("Failed to call myFunction!", err);
//     } else {
//         Logger.log("called myFunction: ", response);
//     }
// });
