import * as React from "react";
import useNotifications from "../shared/hooks/useNotifications";
import DragHandleIcon from "../shared/components/icons/DragHandleIcon";
import NotificationIcon from "../shared/components/icons/NotificationIcon";
import CenterIcon from "../shared/components/icons/CenterIcon";
import SettingsIcon from "../shared/components/icons/settings";
import INotification from "../../types/Notification-definitions/INotification";

function App(): React.ReactElement {
	const { notifications, toggleComponent } = useNotifications();
	const { FSBL } = window;

	FSBL.Clients.HotkeyClient.addGlobalHotkey(["ctrl", "alt", "shift", "t"], () => {
		FSBL.Clients.WindowClient.showAtMousePosition();
	});

	const activeNotifications = (notifications: INotification[]) =>
		notifications.filter(notification => !notification.isSnoozed && !notification.isRead);
	return (
		<>
			<DragHandleIcon className="drag-area" />
			{activeNotifications(notifications).length > 0 && (
				<div id="notification-number">{activeNotifications(notifications).length}</div>
			)}
			<NotificationIcon
				className="toaster-icons"
				onClick={() =>
					toggleComponent({
						windowName: "notification-drawer",
						componentType: "notification-drawer"
					})
				}
			/>
			<CenterIcon
				className="toaster-icons"
				onClick={() => toggleComponent({ windowName: "notification-center", componentType: "notification-center" })}
			/>
			<div id="toaster-divider"></div>
			<SettingsIcon className="toaster-icons" />
		</>
	);
}

export default App;
