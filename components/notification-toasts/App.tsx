import * as React from "react";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";

const { useEffect, useState } = React;

function App(): React.ReactElement {
	const {
		notifications,
		doAction,
		removeNotification,
		getNotificationConfig
	} = useNotifications();

	const [config, setConfig] = useState(null);

	useEffect(() => {
		(async () =>
			setConfig(await getNotificationConfig("notification-toasts")))();
	}, []);

	return (
		<Drawer
			notifications={notifications}
			windowShowParams={{
				bottom: 0,
				right: 0,
				monitor: 0
			}}
		>
			{config &&
				notifications &&
				notifications.map(
					(notification: INotification) =>
						!notification.isActionPerformed &&
						!notification.isSnoozed && (
							<Animate
								key={notification.id}
								displayDuration={
									notification.timeout || config.animation.displayDuration
								}
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
