/**
 * @property {string} id - UUID
 * @property {string} buttonText - Text to display on the button UI.
 * @property {string} type - Type of notification.
 * @property {string} component - Component to perform the action on.
 * @property {Map<string, any>} params - Additional params passed along with action.
 */
export default interface IAction {
    id: string;
    buttonText: string;
    type: string;
    component?: string;
    params?: Map<string, any>;
}
