import INotification from "common/notifications/definitions/INotification";

export interface NotificationGroupList {
	[type: string]: INotification;
}
