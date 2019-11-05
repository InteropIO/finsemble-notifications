/**
 * @property {string} id - UUID
 * @property {Function(notification:INotification)} onNotification - callback for when a subscribing UI component received a notification.
 */
import INotification from "./INotification";
import IFilter from "./IFilter";

export default interface ISubscription {
	id: string;
	filters: IFilter[];

	onNotification: (notification: INotification) => void;
}
