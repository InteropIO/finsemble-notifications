import * as React from "react";
import useNotifications from "../shared/hooks/useNotifications";
import DragHandleIcon from "../shared/components/icons/DragHandleIcon";
import NotificationIcon from "../shared/components/icons/NotificationIcon";
import CenterIcon from "../shared/components/icons/CenterIcon";
import SettingsIcon from "../shared/components/icons/settings";
import _get = require("lodash/get");

function App(): React.ReactElement {
	const { notifications, toggleComponent, activeNotifications } = useNotifications();
	const { FSBL } = window;

	const hotkey = _get(FSBL.Clients.WindowClient.getSpawnData(), "notifications.hotkey", null);

	if (hotkey) {
		FSBL.Clients.HotkeyClient.addGlobalHotkey(hotkey, () => {
			FSBL.Clients.WindowClient.showAtMousePosition();
		});
	}

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
