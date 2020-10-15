/**
 * @property {string} id - UUID.
 * @property {string} datePerformed - An ISO8601 formatted string. When the action was performed.
 */
import IPerformedAction from "./IPerformedAction";

export default class PerformedAction implements IPerformedAction {
	id: string;
	type: string;
	datePerformed: string;

	constructor(id: string, type: string, datePerformed: string) {
		this.id = id;
		this.type = type;
		this.datePerformed = datePerformed;
	}
}
