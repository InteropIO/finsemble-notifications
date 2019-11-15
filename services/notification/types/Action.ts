import IAction from "./IAction";

export default class Action implements IAction {
    id: string;

    /**
     * @description The button things
     */
    buttonText: string;
    type: string;
    component?: string;
    params?: Map<string, any>;
}
