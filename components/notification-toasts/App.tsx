import * as React from "react";
import { StoreProvider } from "../shared/stores/NotificationStore";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";

function App(): React.ReactElement {
	const { notifications, doAction } = useNotifications();
	// TODO: a local state of the notifications would be a good, any changes then add or remove to this from the global state
	// TODO: FSBL.Clients.WindowClient.minimize, this might be a good option when all the toasts have been removed from the drawer

	return (
		<StoreProvider>
			<Drawer notifications={notifications}>
				{notifications &&
					notifications.map((notification: INotification) => (
						<Animate
							displayDuration={3000}
							animateIn="slide-in-fwd-bottom"
							animateOut="slide-out-right"
						>
							<Notification
								key={notification.id}
								notification={notification}
								doAction={doAction}
							></Notification>
						</Animate>
					))}
			</Drawer>
		</StoreProvider>
	);
}

export default App;
