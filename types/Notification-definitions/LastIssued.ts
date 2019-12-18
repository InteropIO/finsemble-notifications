/**
 * @property {string} source - UUID
 * @property {Date} lastUpdated - Text to display on the button UI.
 */
import ILastIssued from "./ILastIssued";

export default class LastIssued implements ILastIssued {
    source: string;
    issuedAt: string;

    constructor(source: string, issuedAt: string) {
        this.source = source;
        this.issuedAt = issuedAt;
    }
}
