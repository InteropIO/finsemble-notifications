/**
 * @property {string} id - UUID
 * @property {Function(notification:INotification)} onNotification - callback for when a subscribing UI component received a notification.
 */
import INotification from "./INotification";
import IFilter from "./IFilter";

/**
 * TODO: Ensure this interface (or implemented type) is publicly accessible
 */
export default interface ISubscription {
	id: string;
	filter: IFilter;
	channel?: string;

	onNotification: (notification: INotification) => void;
}
