import * as React from "react";
import { StoreProvider } from "../shared/stores/NotificationStore";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import { useEffect } from "react";
import Animate from "../shared/components/Animate";

function App(): React.ReactElement {
	const { notifications, doAction } = useNotifications();
	return (
		<Drawer>
			{notifications &&
				notifications.map(
					(notification: INotification) =>
						!notification.isSnoozed &&
						!notification.isActionPerformed && (
							<Animate
								// TODO: this needs a better key to differentiate when notification is updated
								key={notification.id}
								animateIn="slide-in-fwd-bottom"
								animateOut="slide-out-right"
							>
								<Notification
									key={notification.id}
									notification={notification}
									doAction={doAction}
								></Notification>
							</Animate>
						)
				)}
		</Drawer>
	);
}

export default App;
