/**
 * @property {string} source - UUID
 * @property {Date} lastUpdated - Text to display on the button UI.
 */
import ILastUpdated from "./LastUpdated";

export default class LastUpdated implements ILastUpdated {
    source: string;
    updated: Date;

    constructor(source: string, updatedDate: Date) {
        this.source = source;
        this.updated = updatedDate;
    }
}
