import IAction from "../IAction";

export default class SnoozeAction implements IAction {
    id: string;
    buttonText: string = 'Snooze';
    component: string;
    params: Map<string, any>;
    type: string = 'snooze';

    constructor() {

    }
}
