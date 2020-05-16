import INotification from "../../types/Notification-definitions/INotification";
import { PurgeConfig } from "../../types/Notification-definitions/NotificationConfig";

const StorageClient = require("@chartiq/finsemble").Clients.StorageClient;

const STORAGE_TOPIC = "finsemble.notifications";
const STORAGE_KEY_LIST = "list.contents";

export default class StorageHelper {
	/**
	 *
	 * @param notifications
	 * @param notification
	 * @param skipStorage
	 */
	public static async persistNotification(
		notifications: Map<string, INotification>,
		notification: INotification,
		skipStorage = false
	): Promise<void> {
		await StorageHelper.storeListIds(notifications);
		await StorageHelper.storeValue(notification.id, notification);
	}

	public static async fetchNotifications(): Promise<Map<string, INotification>> {
		return new Promise<Map<string, INotification>>(async (resolve, reject) => {
			const returnValue = new Map<string, INotification>();
			const keys = await StorageHelper.getValue(STORAGE_KEY_LIST);

			const promises: Promise<INotification>[] = [];

			keys.forEach((key: string) => {
				promises.push(StorageHelper.getNotification(key));
			});

			const notifications = await Promise.all(promises);

			notifications.forEach(notification => {
				returnValue.set(notification.id, notification);
			});

			resolve(returnValue);
		});
	}

	private static async storeListIds(notifications: Map<string, INotification>): Promise<void> {
		const keys = [...notifications.keys()];
		await StorageClient.save({ topic: STORAGE_TOPIC, key: STORAGE_KEY_LIST, value: keys });
	}

	public static async deleteValue(key: string): Promise<void> {
		// TODO: do
		await StorageClient.remove({ topic: STORAGE_TOPIC, key: key });
	}

	private static async storeValue(key: string, value: Record<string, any>): Promise<void> {
		await StorageClient.save({ topic: STORAGE_TOPIC, key: key, value: value });
	}

	private static async getNotification(key: string): Promise<INotification> {
		return await StorageHelper.getValue(key);
	}

	private static async getValue(key: string) {
		return await StorageClient.get({ topic: STORAGE_TOPIC, key: key });
	}
}