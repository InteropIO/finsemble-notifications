import * as React from "react";
import useNotifications from "../shared/hooks/useNotifications";
import DragHandleIcon from "../shared/components/icons/DragHandleIcon";
import NotificationIcon from "../shared/components/icons/NotificationIcon";
import CenterIcon from "../shared/components/icons/CenterIcon";
import SettingsIcon from "../shared/components/icons/settings";

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
	const showCenter = () => {
		console.log("CLICKEDDDDDDD");
		FSBL.Clients.LauncherClient.showWindow(
			{ windowName: "", componentType: "notification-center" },
			{},
			console.log
		);
	};
	return (
		<>
			<DragHandleIcon className="drag-area" />
			{notifications.length > 0 && (
				<div id="notification-number">{notifications.length}</div>
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
