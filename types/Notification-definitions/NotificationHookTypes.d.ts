import INotification from "./INotification";

export interface NotificationGroupList {
	[type: string]: INotification;
}
