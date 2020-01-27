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

	const config = getWindowSpawnData();
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
									displayDuration={config.displayDuration}
									animateIn={config.animateIn}
									animateOut={config.animateOut}
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
