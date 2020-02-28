import * as React from "react";
import useNotifications from "../shared/hooks/useNotifications";
import NotificationCenter from "./components/NotificationCenter";
import NotificationsPanel from "./components/NotificationsPanel";
import NotificationDetailPanel from "./components/NotificationDetailPanel";
import { useState } from "react";

const App = (): React.ReactElement => {
	const { notifications, doAction } = useNotifications();
	const [activeNotification, setActiveNotification] = useState();

	return (
		<div id="app">
			<NotificationCenter title="Notification Center">
				<div id="main-content">
					{notifications.length === 0 ? (
						// TODO:Add animated no notification component
						<p>Good news no notifications!</p>
					) : (
						<>
							<NotificationsPanel notifications={notifications} setActiveNotification={setActiveNotification} />
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
