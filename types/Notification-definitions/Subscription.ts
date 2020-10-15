import ISubscription from "./ISubscription";
import INotification from "./INotification";
import IFilter from "./IFilter";
import { OnNotificationCallback } from "./Callbacks";

export default class Subscription implements ISubscription {
	id?: string;
	filter?: IFilter;
	onNotification: OnNotificationCallback;

	/**
	 *
	 * @param {IFilter|null} filter
	 * @param onNotification
	 */
	constructor(filter?: IFilter, onNotification?: (notification: INotification) => void) {
		this.filter = filter;
		// @ts-ignore
		this.onNotification = onNotification ? onNotification : undefined;
	}
}
