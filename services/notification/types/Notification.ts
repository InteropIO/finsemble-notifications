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
    issuedAt: Date;
    meta: Map<string, any>;
    timeout: number;
    title: string;
    type: string;

}
