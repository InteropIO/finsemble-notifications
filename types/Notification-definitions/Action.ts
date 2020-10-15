import IAction from "./IAction";

export default class Action implements IAction {
	id?: string;
	buttonText?: string;
	type?: string;
	milliseconds?: number;
	component?: string;
	spawnParams?: Record<string, any>;
	channel?: string;
	payload?: any;
}
