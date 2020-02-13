/**
 * @class Meta
 *
 */
export default class Meta {
	/**
	 * An array of objects. If more than one object is used it will use an OR match.
	 *
	 * @name Meta#cssClassName
	 * @type string
	 */
	cssClassName?: string;
	notificationAlertSound?: string;

	/**
	 * Allows for putting any key that is a string onto this object.
	 *
	 * @type any
	 */
	[key: string]: any|{};
}
