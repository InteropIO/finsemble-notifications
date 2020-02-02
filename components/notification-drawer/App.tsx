import * as React from "react";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";

function App(): React.ReactElement {
	const { notifications, doAction } = useNotifications();

	return (
		<Drawer>
			<div id="notifications-drawer__menu">
				<img
					src="../shared/assets/dashboard.svg"
					id="notification-center-icon"
					onClick={() =>
						FSBL.Clients.LauncherClient.showWindow({
							componentType: "notification-center"
						})
					}
				/>
				<img
					src="../shared/assets/double_arrow.svg"
					id="hide-icon"
					onClick={() => FSBL.Clients.WindowClient.minimize()}
				/>
			</div>
			<div>
				{notifications &&
					[...notifications].reverse().map(
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
			</div>
		</Drawer>
	);
}

export default App;
