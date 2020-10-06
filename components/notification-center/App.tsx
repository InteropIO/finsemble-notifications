import * as React from "react";
import _get from "lodash.get";
import useNotifications from "../shared/hooks/useNotifications";
import NotificationCenter from "./components/NotificationCenter";
import NotificationsPanel from "./components/NotificationsPanel";
import NotificationDetailPanel from "./components/NotificationDetailPanel";
import { usePubSub } from "../shared/hooks/finsemble-hooks";

import { useState, useEffect } from "react";
import INotification from "../../types/Notification-definitions/INotification";

const App = (): React.ReactElement => {
	const { notifications, doAction, getNotificationConfig } = useNotifications();
	const [activeNotification, setActiveNotification] = useState();
	const pubSubTopic = "notification-ui";
	const [notificationSubscribeMessage, notificationsPublish] = usePubSub(pubSubTopic);

	const config = getNotificationConfig();
	const applyMuteFilters = _get(config, "applyMuteFilters", false);

	const muteFilter = (notifications: INotification[]) =>
		notifications.filter(notification => (applyMuteFilters ? !notification.isMuted : true));

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
								notifications={muteFilter(notifications)}
								setActiveNotification={setActiveNotification}
							/>
							{activeNotification && (
								<NotificationDetailPanel
									notification={activeNotification}
									clearActiveNotification={setActiveNotification}
									doAction={doAction}
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
