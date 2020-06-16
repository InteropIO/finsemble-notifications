import * as React from "react";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";
import { SpawnParams } from "../../types/FSBL-definitions/services/window/Launcher/launcher";
/* eslint-disable @typescript-eslint/no-var-requires */
const _get = require("lodash.get");
const { useEffect } = React;

function App(): React.ReactElement {
	const {
		notifications,
		doAction,
		removeNotification,
		getNotificationConfig,
		notificationIsActive
	} = useNotifications();

	const config = getNotificationConfig("notification-toasts");

	const windowShowParams: SpawnParams = _get(config, "config.position", {
		bottom: 0,
		right: 0,
		monitor: 0
	});

	// ensure the config and notifications have loaded before rendering the DOM
	const ready = config && notifications;

	useEffect(() => {
		if (notifications.length === 0) {
			finsembleWindow.hide();
		} else {
			finsembleWindow.show(null);
			finsembleWindow.bringToFront();
			const rect = document.getElementById("toasts-drawer").getBoundingClientRect();
			const roundedRect = {
				x: Math.round(rect.x),
				y: Math.round(rect.y),
				width: Math.round(rect.width),
				height: Math.round(rect.height)
			};
			FSBL.Clients.WindowClient.setShape([roundedRect]);
		}
	}, [notifications.length]);

	return (
		<Drawer notifications={notifications} windowShowParams={windowShowParams}>
			{ready &&
				notifications.map(
					(notification: INotification) =>
						notificationIsActive(notification) && (
							// TODO: Recommend to change this to react transition group
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
									overflowCount={3}
								/>
							</Animate>
						)
				)}
		</Drawer>
	);
}

export default App;
