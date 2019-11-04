//Create and export functions which use the router to communicate with your service 
export function myFunction(cb) {
    FSBL.Clients.Logger.log("notification.myFunction called");
    FSBL.Clients.RouterClient.query("notification functions", { query: "myFunction" }, function (err, response) {
        FSBL.Clients.Logger.log("notification.myFunction response: ", response.data);
        if (cb) {
            cb(err, response.data);
        }
    });
};

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