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
			<div>
				{notifications &&
					[...notifications].reverse().map(
						(notification: INotification) =>
							!notification.isSnoozed &&
							!notification.isRead && (
								<Animate
									// TODO: this needs a better key to differentiate when notification is updated
									key={notification.id}
									animateIn="slide-in-fwd-bottom"
									animateOut="slide-out-right"
									// eslint-disable-next-line @typescript-eslint/no-empty-function
									animateOutComplete={() => {}}
								>
									<Notification key={notification.id} notification={notification} doAction={doAction}></Notification>
								</Animate>
							)
					)}
			</div>
		</Drawer>
	);
}

export default App;
