import INotification from "./INotification";
import IPerformedAction from "./IPerformedAction";
import IAction from "./IAction";

export default class Notification implements INotification {
	actions: IAction[];
	actionsHistory: IPerformedAction[];
	contentLogo: string;
	details: string;
	isActionPerformed: boolean;
	isSnoozed: boolean;
	receivedAt?: string;
	headerLogo: string;
	headerText: string;
	id: string;
	issuedAt: string;
	meta: Map<string, any>;
	timeout: number;
	title: string;
	type: string;
	source: string;

	constructor() {
		this.actions = [];
		this.isActionPerformed = false;
		this.isSnoozed = false;
		this.actionsHistory = [];
		this.meta = new Map<string, any>();
	}
}
