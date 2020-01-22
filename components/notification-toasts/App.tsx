import * as React from "react";
import { StoreProvider } from "../shared/stores/NotificationStore";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";

function App(): React.ReactElement {
	const {
		notifications,
		doAction,
		removeNotification,
		getWindowSpawnData
	} = useNotifications();

	const spawnConfig = {
		bottom: 0,
		right: 0,
		monitor: 0,
		position: "available"
	};
	// const config = getWindowSpawnData().config || spawnConfig;
	const config = spawnConfig;

	return (
		<StoreProvider>
			<Drawer notifications={notifications} windowShowParams={config}>
				{notifications &&
					notifications.map(
						(notification: INotification) =>
							!notification.isActionPerformed &&
							!notification.isSnoozed && (
								<Animate
									key={notification.id}
									displayDuration={6000}
									animateIn="slide-in-right"
									animateOut="slide-out-right"
									animateOutComplete={() => removeNotification(notification)}
								>
									<Notification
										key={notification.id}
										notification={notification}
										doAction={doAction}
										closeAction={() => removeNotification(notification)}
									></Notification>
								</Animate>
							)
					)}
			</Drawer>
		</StoreProvider>
	);
}

export default App;
