import INotification from "../../types/Notification-definitions/INotification";
import { PurgeConfig } from "../../types/Notification-definitions/NotificationConfig";

const STORAGE_KEY = "finsemble.notifications";

export default class StorageHelper {
	/**
	 *
	 * @param notifications
	 * @param notification
	 * @param skipStorage
	 */
	public static persistNotification(
		notifications: Map<string, INotification>,
		notification: INotification,
		skipStorage = false
	): Promise<void> {
		return new Promise<void>(async resolve => {
			await StorageHelper.storeListIds(notifications);
			await StorageHelper.storeValue(notification.id, notification);
			resolve();
		});
	}

	public fetchNotifications(): Promise<Map<string, INotification>> {
		return new Promise<Map<string, INotification>>(() => {
			// TODO: do
		});
	}

	private static storeListIds(notifications: Map<string, INotification>): Promise<void> {
		return new Promise<void>(resolve => {
			const keys = [...notifications.keys()];
			// TODO: Store the keys
		});
	}

	public static deleteValue(key: string): void {
		// TODO: do
	}

	private static storeValue(key: string, value: Record<string, any>): void {
		// TODO: do
	}
}
