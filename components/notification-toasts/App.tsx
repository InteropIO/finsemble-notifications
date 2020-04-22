import * as React from "react";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";
import { SpawnParams } from "../../types/FSBL-definitions/services/window/Launcher/launcher";
import { clickThrough } from "../shared/hooks/finsemble-hooks";
/* eslint-disable @typescript-eslint/no-var-requires */
const _get = require("lodash.get");
const { useEffect } = React;

function App(): React.ReactElement {
	const { notifications, doAction, removeNotification, getNotificationConfig } = useNotifications();

	const config = getNotificationConfig("notification-toasts");

	const windowShowParams: SpawnParams = _get(config, "config.position", {
		bottom: 0,
		right: 0,
		monitor: 0
	});

	const notificationIsActive = (notification: INotification) => !notification.isRead && !notification.isSnoozed;

	// ensure the config and notifications have loaded before rendering the DOM
	const ready = config && notifications;

	return (
		<Drawer
			notifications={notifications}
			windowShowParams={windowShowParams}
			onMouseEnter={() => {
				clickThrough(true);
			}}
		>
			{ready &&
				notifications.map(
					(notification: INotification) =>
						notificationIsActive(notification) && (
							<Animate
								key={notification.id}
								displayDuration={notification.timeout || config.animation.displayDuration}
								animateIn={config.animation.animateIn}
								animateOut={config.animation.animateOut}
								animateOutComplete={() => removeNotification(notification)}
							>
								<Notification
									key={notification.id}
									notification={notification}
									doAction={doAction}
									closeAction={() => removeNotification(notification)}
									closeButton
									onMouseEnter={() => {
										clickThrough(false);
									}}
									onMouseLeave={() => {
										clickThrough(true);
									}}
								></Notification>
							</Animate>
						)
				)}
		</Drawer>
	);
}

export default App;
