import ISubscription from "./ISubscription";
import INotification from "./INotification";
import IFilter from "./IFilter";

export default class Subscription implements ISubscription {
	id: string;
	filters: IFilter[];
	onNotification: (notification: INotification) => void;

	/**
	 *
	 * @param {string|null} id
	 * @param {IFilter[]|null} filters
	 * @param onNotification
	 */
	constructor(id?: string, filters?: IFilter[], onNotification?: (notification: INotification) => void) {
		this.id = id ? id : null;
		this.filters = filters ? filters : [];
		this.onNotification = onNotification ? onNotification : null;
	}
}
