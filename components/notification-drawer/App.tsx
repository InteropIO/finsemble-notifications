import * as React from "react";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";
import CenterIcon from "../shared/components/icons/CenterIcon";

const { useState } = React;

const ActiveNotification = ({ notification, doAction }: { notification: INotification; doAction: Function }) =>
	!notification.isSnoozed &&
	!notification.isRead && (
		<Animate
			// TODO: this needs a better key to differentiate when notification is updated
			animateIn="slide-in-fwd-bottom"
			animateOut="slide-out-right"
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			animateOutComplete={() => {}}
		>
			<Notification notification={notification} doAction={doAction}></Notification>
		</Animate>
	);
const HideDrawer = ({ clickAction }: { clickAction: Function }) => (
	<img src="../shared/assets/double_arrow.svg" id="hide-icon" onClick={clickAction()} />
);

function App(): React.ReactElement {
	const { notifications, doAction, toggleComponent } = useNotifications();
	const [showDrawer, setShowDrawer] = useState(false);
	// "slide-in-right"
	// "slide-out-right"

	return (
		<Drawer>
			<div id="notifications-drawer__menu">
				<CenterIcon
					id="notification-center-icon"
					onClick={() => toggleComponent({ windowName: "notification-center", componentType: "notification-center" })}
				/>
				<HideDrawer clickAction={() => setShowDrawer(false)} />
			</div>
			<div>
				{notifications ? (
					[...notifications].map((notification: INotification) => (
						<ActiveNotification notification={notification} key={notification.id} doAction={doAction} />
					))
				) : (
					<p>no notifications</p>
				)}
			</div>
		</Drawer>
	);
}

export default App;
