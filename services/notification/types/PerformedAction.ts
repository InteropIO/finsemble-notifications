/**
 * @property {string} id - UUID.
 * @property {Date} datePerformed - When the action was performed.
 */
import IPerformedAction from "./IPerformedAction";

export default class PerformedAction implements IPerformedAction {
    id: string;
    type: string;
    datePerformed: Date;
}
