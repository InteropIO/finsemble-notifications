import INotification from "../../types/Notification-definitions/INotification";
import Action from "../../types/Notification-definitions/Action";
import {ActionTypes} from "../../types/Notification-definitions/ActionTypes";
import IFilter from "../../types/Notification-definitions/IFilter";


const searchJS = require("searchjs");
const {Map: ImmutableMap, mergeDeepWith, mergeDeep} = require('immutable');


const DEFAULT_TYPE_NAME = 'default';

const KEY_NAME_DEFAULT_FIELDS = 'defaults';
const KEY_NAME_DISMISS_BUTTON_TEXT = 'defaultDismissButtonText';
const KEY_NAME_SHOW_DISMISS_ACTION = 'showDismissAction';

const DISMISS_BUTTON_TEXT_FALLBACK = 'Dismiss';

export default class ServiceHelper {

	/**
	 * Isolates the notification types from a specific part of the config tree
	 * @param config
	 */

	public static normaliseConfig(config: Object): Object {
		// TODO: Input validation
		return {
			"service": ServiceHelper.getServiceDefaults(config),
			"types": ServiceHelper.getTypes(config)
		};
	}

	public static getTypes(config: Object): Object {
		return Object.assign({}, config && config.hasOwnProperty("types") ? config["types"] : null);
	}

	public static getServiceDefaults(config: Object): Object {
		const defaults = Object.assign({}, config);
		if (defaults.hasOwnProperty("types")) {
			delete defaults["types"];
		}

		if (defaults.hasOwnProperty("presentationComponents")) {
			delete defaults["presentationComponents"];
		}

		return defaults;
	}

	/**
	 * Applies the defaults defined in the config object to a notification base on the INotification.type
	 *
	 * @param config {Object}
	 * @param notification {INotification}
	 */
	public static applyDefaults(config: any, notification: INotification): INotification {
		let configToApply;

		if (config && config["types"] &&  config["types"][notification.type]) {
			configToApply = config["types"][notification.type];
		} else if (config && config["types"] &&  config["types"][DEFAULT_TYPE_NAME]) {
			configToApply = config["types"][DEFAULT_TYPE_NAME];
		}

		// A config has not been supplied at all
		if (configToApply) {
			let returnValue = notification;

			if (configToApply.hasOwnProperty(KEY_NAME_DEFAULT_FIELDS)) {
				let map = ImmutableMap(notification);
				map = mergeDeepWith(
					ServiceHelper.merge,
					map,
					configToApply[KEY_NAME_DEFAULT_FIELDS]
				);
				returnValue = map.toObject();
			}

			const showDismissAction = configToApply.hasOwnProperty(KEY_NAME_SHOW_DISMISS_ACTION) ? configToApply[KEY_NAME_SHOW_DISMISS_ACTION] : false;

			if (showDismissAction) {
				let dismissText = DISMISS_BUTTON_TEXT_FALLBACK;

				if (configToApply.hasOwnProperty(KEY_NAME_DISMISS_BUTTON_TEXT)) {
					dismissText = configToApply[KEY_NAME_DISMISS_BUTTON_TEXT];
				} else if (config.hasOwnProperty("service") && config.service.hasOwnProperty(KEY_NAME_DISMISS_BUTTON_TEXT)) {
					dismissText = config.service[KEY_NAME_DISMISS_BUTTON_TEXT];
				}
				returnValue = ServiceHelper.addDismissActionToNotification(returnValue, dismissText);
			}

			return returnValue;
		} else {
			return notification;
		}
	}

	/**
	 * Adds a dismiss action to a notification if one does not already exist
	 * @param notification
	 */
	public static addDismissActionToNotification(notification: INotification, buttonText: string): INotification {
		if (!ServiceHelper.hasDismissAction(notification)) {
			const action = new Action();
			action.type = ActionTypes.DISMISS;
			action.buttonText = buttonText;
			notification.actions.push(action);
		}

		return notification;
	}

	public static hasDismissAction(notification: INotification) {
		let returnValue = false;
		notification.actions.forEach((action) => {
			if (action.type.toLowerCase() === "dismiss") {
				returnValue = true;
			}
		});

		return returnValue;
	}

	public static merge(oldVal: any, newVal: any) {
		if (oldVal) {
			if (typeof oldVal === 'object') {
				return mergeDeepWith(ServiceHelper.merge, ImmutableMap(oldVal), newVal).toObject();
			} else {
				return oldVal;
			}
		} else {
			return newVal;
		}
	}

	public static filterMatches(filter: IFilter, notification: INotification): boolean {
		// All notifications match if the filters are empty
		const includeExists:boolean = filter && filter.include && filter.include.length > 0;
		const excludeExists:boolean = filter && filter.exclude && filter.exclude.length > 0;

		if(!includeExists && !excludeExists) {
			// Empty filters will match everything
			return true
		}

		let isMatch = !includeExists;

		filter.include.forEach((filterToMatch) => {
			if(searchJS.matchObject(notification, filterToMatch)) {
				isMatch = true;
			}
		});

		filter.exclude.forEach((filterToMatch) => {
			if(searchJS.matchObject(notification, filterToMatch)) {
				isMatch = false;
			}
		});

		return isMatch;
	}
}
