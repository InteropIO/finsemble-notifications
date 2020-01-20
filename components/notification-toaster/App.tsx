import * as React from "react";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";
import NotificationIcon from "../notification-icon/NotificationIcon";

function App(): React.ReactElement {
	const { notifications, doAction } = useNotifications();
	const { FSBL } = window;
	const showDrawer = () => {
		FSBL.Clients.LauncherClient.showWindow(
			{ windowName: "", componentType: "notification-drawer" },
			{},
			console.log
		);
	};
	return (
		<>
			<div className="drag-area drag-box"></div>
			<NotificationIcon action={showDrawer} />
		</>
	);
}

export default App;
