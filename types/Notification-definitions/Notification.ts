import INotification from "./INotification";
import IPerformedAction from "./IPerformedAction";
import IAction from "./IAction";

export default class Notification implements INotification {
    actions: IAction[];
    actionsHistory: IPerformedAction[];
    contentLogo: string;
    details: string;
    dismissedAt: Date;
    headerLogo: string;
    headerText: string;
    id: string;
    issuedAt: string;
    meta: Map<string, any>;
    isActive: boolean = true;
    timeout: number;
    title: string;
    type: string;
    source: string;

    constructor() {
        this.actions = [];
        this.isActive = true;
        this.actionsHistory = [];
        this.meta = new Map<string, any>();
    }
}
