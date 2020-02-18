import * as React from "react";
import useNotifications from "../shared/hooks/useNotifications";
import DragHandleIcon from "../shared/components/icons/DragHandleIcon";
import NotificationIcon from "../shared/components/icons/NotificationIcon";
import CenterIcon from "../shared/components/icons/CenterIcon";
import SettingsIcon from "../shared/components/icons/settings";
import INotification from "../../types/Notification-definitions/INotification";

function App(): React.ReactElement {
	const { notifications } = useNotifications();
	const { FSBL } = window;
	const showDrawer = () => {
		FSBL.Clients.LauncherClient.showWindow(
			{ windowName: "", componentType: "notification-drawer" },
			{}
		);
	};
	const showCenter = () => {
		FSBL.Clients.LauncherClient.showWindow(
			{ windowName: "", componentType: "notification-center" },
			{}
		);
	};

	const activeNotifications = (notifications: INotification[]) =>
		notifications.filter(
			notification => !notification.isSnoozed && !notification.isRead
		);
	return (
		<>
			<DragHandleIcon className="drag-area" />
			{activeNotifications(notifications).length > 0 && (
				<div id="notification-number">
					{activeNotifications(notifications).length}
				</div>
			)}
			<NotificationIcon
				className="toaster-icons"
				onClick={() => showDrawer()}
			/>
			<CenterIcon className="toaster-icons" onClick={() => showCenter()} />
			<div id="toaster-divider"></div>
			<SettingsIcon className="toaster-icons" />
		</>
	);
}

export default App;
