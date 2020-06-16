/* eslint-disable @typescript-eslint/ban-ts-ignore */
import Filter from "../../types/Notification-definitions/Filter";

import { expect } from "chai";
import ServiceHelper from "../../services/helpers/ServiceHelper";
import Notification from "../../types/Notification-definitions/Notification";
import Action from "../../types/Notification-definitions/Action";
import { ActionTypes } from "../../types/Notification-definitions/ActionTypes";
import INotification from "../../types/Notification-definitions/INotification";
import IPerformedAction from "../../types/Notification-definitions/IPerformedAction";
import PerformedAction from "../../types/Notification-definitions/PerformedAction";

describe("Configuration", () => {
	let normalisedConfig: any;

	const config: any = {
		defaultDismissButtonText: "Service Default Dismiss",
		maxNotificationsToRetain: 2000,
		maxNotificationRetentionPeriodSeconds: 100,
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
					cssClassName: "cssClassName",
					notificationAlertSound: "defaultNotificationSound",
					meta: {
						other: "red"
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
		normalisedConfig = ServiceHelper.normaliseConfig(config) as object;
	});

	it("Can extract information from the config", () => {
		expect(normalisedConfig).to.be.an("Object");
		expect(normalisedConfig.hasOwnProperty("types")).to.equal(true);
		expect(normalisedConfig.hasOwnProperty("service")).to.equal(true);
	});

	it("Can pass null to normalise config", () => {
		const normalisedConfig = ServiceHelper.normaliseConfig(null);
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

		const defaults = ServiceHelper.getServiceDefaults(config);
		expect(defaults).to.be.an("object");
		expect(defaults.hasOwnProperty("types")).to.equal(false);
		expect(defaults.hasOwnProperty("presentationComponents")).to.equal(false);
		expect(defaults.hasOwnProperty("defaultDismissButtonText")).to.equal(true);
		expect(defaults.hasOwnProperty("maxNotificationsToRetain")).to.equal(true);
		expect(defaults.hasOwnProperty("maxNotificationRetentionPeriodSeconds")).to.equal(true);
		expect(defaults["maxNotificationsToRetain"]).to.equal(2000);
		expect(defaults["maxNotificationRetentionPeriodSeconds"]).to.equal(100);
	});

	it("Can get purge defaults if not set", () => {
		expect(() => {
			ServiceHelper.getTypes(null);
		}).to.not.throw(Error);

		expect(() => {
			ServiceHelper.getTypes({});
		}).to.not.throw(Error);

		const defaults = ServiceHelper.getServiceDefaults({});
		expect(defaults.hasOwnProperty("maxNotificationsToRetain")).to.equal(true);
		expect(defaults.hasOwnProperty("maxNotificationRetentionPeriodSeconds")).to.equal(true);
		expect(defaults["maxNotificationsToRetain"]).to.equal(1000);
		expect(defaults["maxNotificationRetentionPeriodSeconds"]).to.equal(false);
	});

	it("Can get types from the config", () => {
		expect(() => {
			ServiceHelper.getTypes(null);
		}).to.not.throw(Error);

		expect(() => {
			ServiceHelper.getTypes({});
		}).to.not.throw(Error);

		const types = ServiceHelper.getTypes(config) as any;
		expect(types).to.not.be.undefined;
		expect(types).to.be.an("Object");
		expect(types.hasOwnProperty("default")).to.equal(true);
		expect(types.hasOwnProperty("toast")).to.equal(true);
		expect(types["default"]).to.be.an("object", "No default type set");
		expect(types["toast"]).to.be.an("object");

		expect(types["toast"]["defaults"]).to.be.an("object", "No defaults set in the toast type");
	});

	it("Can check if a dismiss action is present", () => {
		const notification = new Notification();
		expect(ServiceHelper.hasDismissAction(notification)).to.equal(false, "Has dismiss when it shouldn't");
		const action = new Action();
		action.type = ActionTypes.DISMISS;
		notification.actions.push(action);
		expect(ServiceHelper.hasDismissAction(notification)).to.equal(true, "Does not have dismiss action when it should");
	});

	it("Can add dismiss to a notification if one does not exist", () => {
		let notification = new Notification();

		notification = ServiceHelper.addDismissActionToNotification(notification, "ButtonText");
		expect(notification.actions.length).to.equal(1);
		expect(notification.actions[0].type).to.equal(ActionTypes.DISMISS);
		expect(notification.actions[0].buttonText).to.equal("ButtonText");

		notification = ServiceHelper.addDismissActionToNotification(notification, "Blah");
		expect(notification.actions.length).to.equal(1);
		expect(notification.actions[0].type).to.equal(ActionTypes.DISMISS);
		expect(notification.actions[0].buttonText).to.not.equal("Blah");
		expect(notification.actions[0].buttonText).to.equal("ButtonText");
	});

	it("Can be able to apply type defaults to a notification", () => {
		let defaultNotification = new Notification();
		defaultNotification.type = "should-apply-default";
		defaultNotification = ServiceHelper.applyDefaults(normalisedConfig, defaultNotification);
		defaultNotification.meta.other = "already set";

		expect(defaultNotification).to.be.an("object");
		expect(defaultNotification.timeout).to.equal(1234, "timeout not set");
		expect(defaultNotification.headerLogo).to.equal("defaultHeaderLogo", "Header logo not set");
		expect(defaultNotification.contentLogo).to.equal("defaultContentLogo", "Content logo not set");
		expect(defaultNotification.title).to.equal("defaultTitle", "Title not set");
		expect(defaultNotification.details).to.equal("defaultDetails", "Detail not set");
		expect(defaultNotification.headerText).to.equal("defaultHeaderText", "Header text not set");
		expect(defaultNotification.meta).to.be.an("Object", "Meta is not an object");
		expect(defaultNotification.cssClassName).to.equal("cssClassName", "Css class name not set");
		expect(defaultNotification.meta.other).to.equal("already set", "Should not override sound");
		expect(ServiceHelper.hasDismissAction(defaultNotification)).to.equal(true, "No dismiss action");
		expect(defaultNotification.actions[0].buttonText).to.equal("Default Button Text", "Button text not set correctly");

		let type3 = new Notification();
		type3.type = "type3";

		type3 = ServiceHelper.applyDefaults(normalisedConfig, type3);

		expect(ServiceHelper.hasDismissAction(type3)).to.equal(true, "No dismiss action");
		expect(type3.actions[0].buttonText).to.equal("Service Default Dismiss", "Button should default to service value'");

		let toast = new Notification();
		toast.type = "toast";
		toast.contentLogo = "No override";
		toast = ServiceHelper.applyDefaults(normalisedConfig, toast);

		expect(toast).to.be.an("object");
		expect(ServiceHelper.hasDismissAction(toast)).to.equal(false);
		expect(toast.headerLogo).to.equal("toast logo", "Using incorrect config to set defaults");
		expect(toast.contentLogo).to.equal("No override", "Should not override value");
	});

	it("Can use the service to provide a default action", () => {
		delete normalisedConfig.service.defaultDismissButtonText;

		let type3 = new Notification();
		type3.type = "type3";

		type3 = ServiceHelper.applyDefaults(normalisedConfig, type3);

		expect(ServiceHelper.hasDismissAction(type3)).to.equal(true, "No dismiss action");
		expect(type3.actions[0].buttonText).to.equal("Dismiss", "Button should default to Helper value'");
	});

	it("Does not break if invalid config is input", () => {
		const defaultNotification = new Notification();
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

		expect(ServiceHelper.filterMatches(new Filter(), cheese)).to.equal(true, "Empty filter should always return true");

		// @ts-ignore
		expect(ServiceHelper.filterMatches({}, cheese)).to.equal(true, "Empty filter should always return true");

		expect(ServiceHelper.filterMatches(null, cheese)).to.equal(true, "Empty filter should always return true");
	});

	it("Can match partial filters", () => {
		const filter = {
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

		const filter2 = {
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

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(true, "Empty filter should always return true");
	});

	it("Only matches if fields are the same", () => {
		const cheese = new Notification();
		const filter = new Filter();

		filter.include.push({
			source: "cheese"
		});

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(false, "Does not match on source");

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

		expect(ServiceHelper.filterMatches(filter, cake)).to.equal(false, "Should not match cake");

		filter.include.push({ source: "cake" });

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(true, "Multiple include filters. Should match cheese");
		expect(ServiceHelper.filterMatches(filter, cake)).to.equal(true, "Multiple include filters. Should match cake");
	});

	it("Can exclude only", () => {
		const cheese = new Notification();
		const filter = new Filter();

		filter.exclude.push({
			source: "cheese"
		});

		cheese.source = "cheese";

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(false, "It should not exclude cheese");
	});

	it("Exclude overrides include", () => {
		const cheese = new Notification();
		const filter = new Filter();

		filter.include.push({ source: "cheese" });

		cheese.source = "cheese";

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(true, "Should include result");

		cheese.type = "toast";

		filter.exclude.push({ type: "toast" });

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(false, "Don't exclude result'");
	});

	it("Can match meta", () => {
		const cheese = new Notification();
		const filter = new Filter();
		cheese.meta["tomato"] = "yes";

		filter.include.push({ "meta.tomato": "yes" });

		expect(ServiceHelper.filterMatches(filter, cheese)).to.equal(true, "filters matches on meta data");
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

	it("Can purge items", () => {
		const notifications: Map<string, INotification> = new Map<string, INotification>();

		for (let i = 0; i < 10; i++) {
			const notification = new Notification();
			notification.id = `${i}`;

			let age = 100000;
			if (i >= 6) {
				age = 0;
			}

			const performedAction: IPerformedAction = new PerformedAction();
			performedAction.datePerformed = new Date(Date.now() - age).toISOString();
			notification.actionsHistory.push(performedAction);

			notifications.set(notification.id, notification);
		}

		let canPurge = ServiceHelper.getItemsToPurge(notifications, {
			maxNotificationRetentionPeriodSeconds: false,
			maxNotificationsToRetain: 1000
		});

		expect(canPurge.length).to.equal(0);

		canPurge = ServiceHelper.getItemsToPurge(notifications, {
			maxNotificationRetentionPeriodSeconds: false,
			maxNotificationsToRetain: 5
		});
		expect(canPurge.length).to.equal(5);

		canPurge = ServiceHelper.getItemsToPurge(notifications, {
			maxNotificationRetentionPeriodSeconds: 200000,
			maxNotificationsToRetain: 50
		});

		expect(canPurge.length).to.equal(0);

		canPurge = ServiceHelper.getItemsToPurge(notifications, {
			maxNotificationRetentionPeriodSeconds: 50000,
			maxNotificationsToRetain: 50
		});

		expect(canPurge.length).to.equal(6);

		canPurge = ServiceHelper.getItemsToPurge(notifications, {
			maxNotificationRetentionPeriodSeconds: 50000,
			maxNotificationsToRetain: 3
		});

		expect(canPurge.length).to.equal(7);

		canPurge = ServiceHelper.getItemsToPurge(notifications, {
			maxNotificationRetentionPeriodSeconds: 50000,
			maxNotificationsToRetain: 8
		});

		expect(canPurge.length).to.equal(6);
	});
});
