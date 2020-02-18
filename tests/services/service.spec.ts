import Filter from "../../types/Notification-definitions/Filter";

import { expect } from "chai";
import ServiceHelper from "../../services/helpers/ServiceHelper";
import Notification from "../../types/Notification-definitions/Notification";
import Action from "../../types/Notification-definitions/Action";
import { ActionTypes } from "../../types/Notification-definitions/ActionTypes";
const { Map: ImmutableMap } = require("immutable");

describe("Configuration", () => {
	let normalisedConfig:any;

	let config = {
		defaultDismissButtonText: "Service Default Dismiss",
		maxNotificationsToRetain: 1000,
		maxNotificationRetentionPeriodHours: 24,
		presentationComponents: {
			toast: {
				component: "toast",
				configuration: {
					filter: {
						include: [
							{
								type: "toast"
							}
						]
					},
					position: {
						monitor: "primary",
						bottom: 0,
						left: 100
					}
				}
			},
			center: {
				component: "center",
				configuration: {
					showAllTimelines: false
				}
			},
			drawer: {
				component: "drawer",
				configuration: {
					filter: {
						exclude: [
							{
								type: "toast"
							}
						]
					},
					muteFilters: [
						{
							field: "meta.source",
							value: "/execution notifications|fx markets/"
						}
					],
					position: {
						monitor: "primary",
						bottom: 0,
						left: 100
					}
				}
			}
		},
		types: {
			default: {
				component: "drawer",
				showDismissAction: true,
				defaultDismissButtonText: "Default Button Text",
				defaults: {
					timeout: 1234,
					headerLogo: "defaultHeaderLogo",
					contentLogo: "defaultContentLogo",
					title: "defaultTitle",
					details: "defaultDetails",
					headerText: "defaultHeaderText",
					meta: {
						cssClassName: "cssClassName",
						notificationAlertSound: "defaultNotificationSound"
					}
				},
				displayPriority: 2
			},
			toast: {
				component: "toast",
				showDismissAction: false,
				defaults: {
					timeout: 2000,
					headerLogo: "toast logo",
					contentLogo: "toast content logo"
				},
				displayPriority: 2
			},
			type3: {
				showDismissAction: true
			}
		}
	};

	beforeEach(() => {
		normalisedConfig = ServiceHelper.normaliseConfig(config);
	});

	it("Can extract information from the config", () => {
		expect(normalisedConfig).to.be.an("Object");
		expect(normalisedConfig.hasOwnProperty("types")).to.equal(true);
		expect(normalisedConfig.hasOwnProperty("service")).to.equal(true);
	});

	it("Can pass null to normalise config", () => {
		let normalisedConfig = ServiceHelper.normaliseConfig(null);
		expect(normalisedConfig).to.be.an("Object");
		expect(normalisedConfig.hasOwnProperty("types")).to.equal(true);
		expect(normalisedConfig.hasOwnProperty("service")).to.equal(true);
	});

	it("Can get service defaults from the config", () => {
		expect(() => {
			ServiceHelper.getTypes(null);
		}).to.not.throw(Error);

		expect(() => {
			ServiceHelper.getTypes({});
		}).to.not.throw(Error);

		let defaults = ServiceHelper.getServiceDefaults(config);
		expect(defaults).to.be.an("object");
		expect(defaults.hasOwnProperty("types")).to.equal(false);
		expect(defaults.hasOwnProperty("presentationComponents")).to.equal(false);
		expect(defaults.hasOwnProperty("defaultDismissButtonText")).to.equal(true);
		expect(defaults.hasOwnProperty("maxNotificationsToRetain")).to.equal(true);
		expect(
			defaults.hasOwnProperty("maxNotificationRetentionPeriodHours")
		).to.equal(true);
	});

	it("Can get types from the config", () => {
		expect(() => {
			ServiceHelper.getTypes(null);
		}).to.not.throw(Error);

		expect(() => {
			ServiceHelper.getTypes({});
		}).to.not.throw(Error);

		let types:any = ServiceHelper.getTypes(config);
		expect(types).to.not.be.undefined;
		expect(types).to.be.an("Object");
		expect(types.hasOwnProperty("default")).to.equal(true);
		expect(types.hasOwnProperty("toast")).to.equal(true);
		expect(types["default"]).to.be.an("object", "No default type set");
		expect(types["toast"]).to.be.an("object");

		expect(types["toast"]["defaults"]).to.be.an(
			"object",
			"No defaults set in the toast type"
		);
	});

	it("Can check if a dismiss action is present", () => {
		const notification = new Notification();
		expect(ServiceHelper.hasDismissAction(notification)).to.equal(
			false,
			"Has dismiss when it shouldn't"
		);
		const action = new Action();
		action.type = ActionTypes.DISMISS;
		notification.actions.push(action);
		expect(ServiceHelper.hasDismissAction(notification)).to.equal(
			true,
			"Does not have dismiss action when it should"
		);
	});

	it("Can add dismiss to a notification if one does not exist", () => {
		let notification = new Notification();

		notification = ServiceHelper.addDismissActionToNotification(
			notification,
			"ButtonText"
		);
		expect(notification.actions.length).to.equal(1);
		expect(notification.actions[0].type).to.equal(ActionTypes.DISMISS);
		expect(notification.actions[0].buttonText).to.equal("ButtonText");

		notification = ServiceHelper.addDismissActionToNotification(
			notification,
			"Blah"
		);
		expect(notification.actions.length).to.equal(1);
		expect(notification.actions[0].type).to.equal(ActionTypes.DISMISS);
		expect(notification.actions[0].buttonText).to.not.equal("Blah");
		expect(notification.actions[0].buttonText).to.equal("ButtonText");
	});

	it("Can be able to apply type defaults to a notification", () => {
		let defaultNotification = new Notification();
		defaultNotification.type = "should-apply-default";
		defaultNotification = ServiceHelper.applyDefaults(
			normalisedConfig,
			defaultNotification
		);
		defaultNotification.meta["notificationAlertSound"] = "already set";

		expect(defaultNotification).to.be.an("object");
		expect(defaultNotification.timeout).to.equal(1234, "timeout not set");
		expect(defaultNotification.headerLogo).to.equal(
			"defaultHeaderLogo",
			"Header logo not set"
		);
		expect(defaultNotification.contentLogo).to.equal(
			"defaultContentLogo",
			"Content logo not set"
		);
		expect(defaultNotification.title).to.equal("defaultTitle", "Title not set");
		expect(defaultNotification.details).to.equal(
			"defaultDetails",
			"Detail not set"
		);
		expect(defaultNotification.headerText).to.equal(
			"defaultHeaderText",
			"Header text not set"
		);
		expect(defaultNotification.meta).to.be.an(
			"Object",
			"Meta is not an object"
		);
		expect(defaultNotification.meta["cssClassName"]).to.equal(
			"cssClassName",
			"Css class name not set"
		);
		expect(defaultNotification.meta["notificationAlertSound"]).to.equal(
			"already set",
			"Should not override sound"
		);
		expect(ServiceHelper.hasDismissAction(defaultNotification)).to.equal(
			true,
			"No dismiss action"
		);
		expect(defaultNotification.actions[0].buttonText).to.equal(
			"Default Button Text",
			"Button text not set correctly"
		);

		let type3 = new Notification();
		type3.type = "type3";

		type3 = ServiceHelper.applyDefaults(normalisedConfig, type3);

		expect(ServiceHelper.hasDismissAction(type3)).to.equal(
			true,
			"No dismiss action"
		);
		expect(type3.actions[0].buttonText).to.equal(
			"Service Default Dismiss",
			"Button should default to service value'"
		);

		let toast = new Notification();
		toast.type = "toast";
		toast.contentLogo = "No override";
		toast = ServiceHelper.applyDefaults(normalisedConfig, toast);

		expect(toast).to.be.an("object");
		expect(ServiceHelper.hasDismissAction(toast)).to.equal(false);
		expect(toast.headerLogo).to.equal(
			"toast logo",
			"Using incorrect config to set defaults"
		);
		expect(toast.contentLogo).to.equal(
			"No override",
			"Should not override value"
		);
	});

	it("Can use the service to provide a default action", () => {
		delete normalisedConfig.service.defaultDismissButtonText;

		let type3 = new Notification();
		type3.type = "type3";

		type3 = ServiceHelper.applyDefaults(normalisedConfig, type3);

		expect(ServiceHelper.hasDismissAction(type3)).to.equal(
			true,
			"No dismiss action"
		);
		expect(type3.actions[0].buttonText).to.equal(
			"Dismiss",
			"Button should default to Helper value'"
		);
	});

	it("Does not break if invalid config is input", () => {
		let defaultNotification = new Notification();
		defaultNotification.type = "should-apply-default";
		expect(() => {
			ServiceHelper.applyDefaults(null, defaultNotification);
		}).to.not.throw(Error);
		expect(() => {
			ServiceHelper.applyDefaults({}, defaultNotification);
		}).to.not.throw(Error);
	});
});

describe("Filtering", () => {
	it("Can match an empty filter", () => {
		const cheese = new Notification();

		expect(ServiceHelper.filterMatches(new Filter(), cheese)).to.equal(
			true,
			"Empty filter should always return true"
		);

		// @ts-ignore
		expect(ServiceHelper.filterMatches({}, cheese)).to.equal(
			true,
			"Empty filter should always return true"
		);

		expect(ServiceHelper.filterMatches(null, cheese)).to.equal(
			true,
			"Empty filter should always return true"
		);
	});

	it("Can match partial filters", () => {
		let filter = {
			exclude: [
				{
					type: "chat"
				}
			]
		};

		const notification = new Notification();

		// @ts-ignore
		expect(ServiceHelper.filterMatches(filter, notification)).to.equal(true);

		notification.type = "chat";
		// @ts-ignore
		expect(ServiceHelper.filterMatches(filter, notification)).to.equal(false);

		let filter2 = {
			include: [
				{
					type: "chat"
				}
			]
		};

		// @ts-ignore
		expect(ServiceHelper.filterMatches(filter2, notification)).to.equal(true);
	});

	it("Can match an empty filter", () => {
		const cheese = new Notification();
		const filter = new Filter();

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			true,
			"Empty filter should always return true"
		);
	});

	it("Only matches if fields are the same", () => {
		const cheese = new Notification();
		const filter = new Filter();

		filter.include.push({
			source: "cheese"
		});

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			false,
			"Does not match on source"
		);

		cheese.source = "cheese";

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			true,
			"Notification comes from `cheese`, should match"
		);
	});

	it("Does not match if fields are not the same", () => {
		const cheese = new Notification();
		cheese.source = "cheese";
		const cake = new Notification();
		cake.source = "cake";

		const filter = new Filter();
		filter.include.push({
			source: "cheese"
		});

		expect(ServiceHelper.filterMatches(filter, cake)).to.equal(
			false,
			"Should not match cake"
		);

		filter.include.push({ source: "cake" });

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			true,
			"Multiple include filters. Should match cheese"
		);
		expect(ServiceHelper.filterMatches(filter, cake)).to.equal(
			true,
			"Multiple include filters. Should match cake"
		);
	});

	it("Can exclude only", () => {
		const cheese = new Notification();
		const filter = new Filter();

		filter.exclude.push({
			source: "cheese"
		});

		cheese.source = "cheese";

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			false,
			"It should not exclude cheese"
		);
	});

	it("Exclude overrides include", () => {
		const cheese = new Notification();
		const filter = new Filter();

		filter.include.push({ source: "cheese" });

		cheese.source = "cheese";

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			true,
			"Should include result"
		);

		cheese.type = "toast";

		filter.exclude.push({ type: "toast" });

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			false,
			"Don't exclude result'"
		);
	});

	it("Can match meta", () => {
		const cheese = new Notification();
		const filter = new Filter();
		cheese.meta["tomato"] = "yes";

		filter.include.push({ "meta.tomato": "yes" });

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			true,
			"filters matches on meta data"
		);
	});

	it("Can include some and exclude some", () => {
		const cheese = new Notification();
		const filter = new Filter();

		cheese.meta["tomato"] = "yes";

		filter.exclude.push({ source: "cheese" });
		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			true,
			"Can use filter with exclude only - does not exclude if no match"
		);

		cheese.source = "cheese";
		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(
			false,
			"Can use filter with exclude only - excludes if match"
		);
	});
});
