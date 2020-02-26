import * as React from "react";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";
import { SpawnParams } from "../../types/FSBL-definitions/services/window/Launcher/launcher";
/* eslint-disable @typescript-eslint/no-var-requires */
const _get = require("lodash.get");

const { useEffect, useState } = React;

function App(): React.ReactElement {
	const { notifications, doAction, removeNotification, getNotificationConfig } = useNotifications();

	const [config, setConfig] = useState(null);

	useEffect(() => {
		(async () => setConfig(await getNotificationConfig("notification-toasts")))();
	}, [getNotificationConfig]);

	const windowShowParams: SpawnParams = _get(config, "config.position", {
		bottom: 0,
		right: 0,
		monitor: 0
	});

	return (
		<Drawer notifications={notifications} windowShowParams={windowShowParams}>
			{config &&
				notifications &&
				notifications.map(
					(notification: INotification) =>
						!notification.isRead &&
						!notification.isSnoozed && (
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
								></Notification>
							</Animate>
						)
				)}
		</Drawer>
	);
}

export default App;
