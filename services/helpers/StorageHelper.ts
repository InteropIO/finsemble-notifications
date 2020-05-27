import INotification from "../../types/Notification-definitions/INotification";
import { PurgeConfig } from "../../types/Notification-definitions/NotificationConfig";
import ILastIssued from "../../types/Notification-definitions/ILastIssued";
import ISnoozeTimer from "../../types/Notification-definitions/ISnoozeTimer";

const StorageClient = require("@chartiq/finsemble").Clients.StorageClient;

const STORAGE_TOPIC = "finsemble.notifications";
const STORAGE_KEY_LAST_ISSUED = "last.issued";
const STORAGE_KEY_SNOOZE_TIMERS = "snooze.timers";
const STORAGE_KEY_LIST = "list.contents";
export const STORAGE_KEY_NOTIFICATION_PREFIX = "id.";

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
		await StorageHelper.storeValue(STORAGE_KEY_NOTIFICATION_PREFIX + notification.id, notification);
	}

	public static async fetchNotifications(): Promise<Map<string, INotification>> {
		return new Promise<Map<string, INotification>>(async (resolve, reject) => {
			const returnValue = new Map<string, INotification>();
			const keys = await StorageHelper.getValue(STORAGE_KEY_LIST);

			const promises: Promise<INotification>[] = [];

			if (keys) {
				keys.forEach((key: string) => {
					promises.push(StorageHelper.getNotification(key));
				});
			}

			const notifications = await Promise.all(promises);

			notifications.forEach(notification => {
				returnValue.set(notification.id, notification);
			});

			resolve(returnValue);
		});
	}

	public static storeLastIssued(lastIssued: Map<string, ILastIssued>): Promise<void> {
		return StorageHelper.storeValue(STORAGE_KEY_LAST_ISSUED, lastIssued);
	}

	public static async fetchLastIssued(): Promise<Map<string, ILastIssued>> {
		return new Promise<Map<string, ILastIssued>>(async resolve => {
			let lastIssued = await StorageHelper.getValue(STORAGE_KEY_LAST_ISSUED);
			if (!lastIssued) {
				lastIssued = new Map<string, ILastIssued>();
			}
			resolve(lastIssued);
		});
	}

	public static storeSnoozeTimers(snoozeTimers: Map<string, ISnoozeTimer>): Promise<void> {
		return StorageHelper.storeValue(STORAGE_KEY_SNOOZE_TIMERS, snoozeTimers);
	}

	public static async fetchSnoozeTimers(): Promise<Map<string, ISnoozeTimer>> {
		return new Promise<Map<string, ISnoozeTimer>>(async resolve => {
			let snoozeTimers = await StorageHelper.getValue(STORAGE_KEY_SNOOZE_TIMERS);
			if (!snoozeTimers) {
				snoozeTimers = new Map<string, ISnoozeTimer>();
			}
			resolve(snoozeTimers);
		});
	}

	private static async storeListIds(notifications: Map<string, INotification>): Promise<void> {
		const keys = [...notifications.keys()];
		await StorageClient.save({ topic: STORAGE_TOPIC, key: STORAGE_KEY_LIST, value: keys });
	}

	private static async getNotification(key: string): Promise<INotification> {
		return await StorageHelper.getValue(STORAGE_KEY_NOTIFICATION_PREFIX + key);
	}

	public static async deleteValue(key: string): Promise<void> {
		await StorageClient.remove({ topic: STORAGE_TOPIC, key: key });
	}

	private static async storeValue(key: string, value: Record<string, any>): Promise<void> {
		await StorageClient.save({ topic: STORAGE_TOPIC, key: key, value: value });
	}

	private static async getValue(key: string) {
		return await StorageClient.get({ topic: STORAGE_TOPIC, key: key });
	}
}
