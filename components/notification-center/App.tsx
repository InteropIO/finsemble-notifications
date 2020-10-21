import * as React from "react";
import useNotifications from "../shared/hooks/useNotifications";
import NotificationCenter from "./components/NotificationCenter";
import NotificationsPanel from "./components/NotificationsPanel";
import NotificationDetailPanel from "./components/NotificationDetailPanel";
import { usePubSub } from "../shared/hooks/finsemble-hooks";

import { useState, useEffect } from "react";

const App = (): React.ReactElement => {
	const { notifications, doAction, markNotificationsUnread } = useNotifications();
	const [activeNotification, setActiveNotification] = useState();
	const pubSubTopic = "notification-ui";
	const [notificationSubscribeMessage, notificationsPublish] = usePubSub(pubSubTopic);

	useEffect(() => {
		if ("showCenter" in notificationSubscribeMessage) {
			notificationSubscribeMessage.showCenter ? finsembleWindow.show(null) : finsembleWindow.hide();
		}
	}, [notificationSubscribeMessage]);

	useEffect(() => {
		if (window && window.addEventListener) {
			window.addEventListener("unload", () => {
				const publishValue = { ...notificationSubscribeMessage };
				publishValue["showCenter"] = false;
				notificationsPublish(publishValue);
			});
		}
	}, []);

	return (
		<div id="app">
			<NotificationCenter title="Notification Center">
				<div id="main-content">
					{notifications.length === 0 ? (
						<p>You do not have any notifications!</p>
					) : (
						<>
							<NotificationsPanel
								notifications={notifications}
								setActiveNotification={setActiveNotification}
								doAction={doAction}
								markUnread={markNotificationsUnread}
							/>
							{activeNotification && (
								<NotificationDetailPanel
									notification={activeNotification}
									clearActiveNotification={setActiveNotification}
									doAction={doAction}
									markUnread={markNotificationsUnread}
								/>
							)}
						</>
					)}
				</div>
			</NotificationCenter>
		</div>
	);
};

export default App;
