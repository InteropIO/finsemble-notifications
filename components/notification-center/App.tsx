import * as React from "react";
import useNotifications from "../shared/hooks/useNotifications";
import NotificationCenter from "./components/NotificationCenter";
import FilterPanel from "./components/FilterPanel";
import NotificationsPanel from "./components/NotificationsPanel";
import NotificationDetailPanel from "./components/NotificationDetailPanel";
import INotification from "../../types/Notification-definitions/INotification";
import { useState } from "react";

const App = (): React.ReactElement => {
	const { notifications } = useNotifications();
	const [activeNotification, setActiveNotification] = useState();

	const types: string[] = Array.from(
		new Set(notifications.map((item: INotification) => item.type))
	);

	return (
		<div id="app">
			<NotificationCenter title="Notification Center">
				{/* <FilterPanel types={types} /> */}
				<div id="main-content">
					<NotificationsPanel
						notifications={notifications}
						setActiveNotification={setActiveNotification}
					/>
					{activeNotification && (
						<NotificationDetailPanel
							notification={activeNotification}
							clearActiveNotification={setActiveNotification}
						/>
					)}
				</div>
			</NotificationCenter>
		</div>
	);
};

export default App;
