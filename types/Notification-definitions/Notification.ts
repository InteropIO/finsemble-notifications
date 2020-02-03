import INotification from "./INotification";
import IPerformedAction from "./IPerformedAction";
import IAction from "./IAction";

export default class Notification implements INotification {
	id?: string;
	issuedAt: string;
	receivedAt?: string;
	type?: string;
	source?: string;
	title: string;
	details?: string;
	headerText?: string;
	headerLogo?: string;
	contentLogo?: string;
	timeout?: number;

	isActionPerformed: boolean;
	isSnoozed: boolean;

	actions?: IAction[];
	meta?: Object;
	actionsHistory?: IPerformedAction[];
	stateHistory: INotification[];

	constructor() {
		this.actions = [];
		this.isActionPerformed = false;
		this.isSnoozed = false;
		this.actionsHistory = [];
		this.meta = {};
		this.stateHistory = [];
	}
}
