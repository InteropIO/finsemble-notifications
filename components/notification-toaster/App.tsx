import * as React from "react";
import useNotifications from "../shared/hooks/useNotifications";
import DragHandleIcon from "../shared/components/icons/DragHandleIcon";
import NotificationIcon from "../shared/components/icons/NotificationIcon";
import CenterIcon from "../shared/components/icons/CenterIcon";
import SettingsIcon from "../shared/components/icons/settings";
import _get = require("lodash/get");
import { usePubSub } from "../shared/hooks/finsemble-hooks";

const { useEffect, useState } = React;

function App(): React.ReactElement {
	const { notifications, activeNotifications } = useNotifications();
	const pubSubTopic = "notification-ui";
	const [notificationSubscribeMessage, notificationsPublish] = usePubSub(pubSubTopic);
	const [currentMonitor, setCurrentMonitor] = useState(null);

	const { FSBL } = window;
	const currentWindow = fin.desktop.Window.getCurrent();

	useEffect(() => {
		const hotkey = _get(FSBL.Clients.WindowClient.getSpawnData(), "notifications.hotkey", null);
		console.log(hotkey);

		if (hotkey) {
			FSBL.Clients.HotkeyClient.addGlobalHotkey(hotkey, () => {
				FSBL.Clients.WindowClient.showAtMousePosition();
			});
		}
		return () => {
			// cleanup;
		};
	}, []); // eslint-disable-line

	const toggleDrawer = () => {
		const { showDrawer } = notificationSubscribeMessage;
		const publishValue = { ...notificationSubscribeMessage };
		publishValue.showDrawer = !showDrawer;
		notificationsPublish(publishValue);
	};

	const toggleCenter = async () => {
		const { showCenter = true } = notificationSubscribeMessage;
		const publishValue = { ...notificationSubscribeMessage };
		publishValue["showCenter"] = !showCenter;
		const { data: windows } = await FSBL.Clients.LauncherClient.getActiveDescriptors();
		if ("notification-center" in windows) {
			notificationsPublish(publishValue);
		} else {
			FSBL.Clients.LauncherClient.spawn("notification-center", {});
		}

		// { windowName: "notification-center", componentType: "notification-center" }
		/*
		Two options:
		1) use showWindow to show and spawn if not found and then continue to use wrap to show or hide
		2) get active descriptors to make sure it's spawned, if not spawn it. Next use the router to pass messages to make it show or hide itself. Need to keep a state somewhere OR just rely on the router?
		*/
	};

	const toasterDrag = () => {
		/*
when the toaster is dragged do:
- get the monitor it is on, if it is the same as the monitor in state  do nothing else:
	move both the drawer and toasts to the new monitor.

	Implementation ideas: close the components and spawn them on the correct monitor. The issue may be reloading the component and redrawing the DOM / calls to get all the notifications

	Blockers: Show window does not like to move components to another monitor unless it is top 0 left 0
	*/
	};

	const moveComponentsToToasterMonitor = () => {
		// get the monitor if it has changed then send a command to change the window of both the drawer and the toasts.
		const toasterMonitor = FSBL.Clients.WindowClient.getMonitorInfo(
			{
				windowIdentifier: FSBL.Clients.WindowClient.getWindowIdentifier
			},
			console.log
		);
		if (currentMonitor !== toasterMonitor) {
			const publishValue = { ...notificationSubscribeMessage };
			publishValue["monitor"] = toasterMonitor;
			notificationsPublish(publishValue);
		}

		// (e: any, monitor: any) => {
		// 	component.setBounds(
		// 		{
		// 			top: monitor.availableRect.top,
		// 			left: monitor.availableRect.right - 320,
		// 			height: monitor.availableRect.height,
		// 			width: 320
		// 		},
		// 		(err: any) => {
		// 			console.log(err);
		// 		}
		// 	);
		// 	component.show();
		// }
	};

	const onmousedown = (e: any) => {
		console.log("startmoving", e.nativeEvent);
		currentWindow.startMovingWindow(e.nativeEvent);
	};
	const onmouseup = () => {
		console.log("stopmoving");
		currentWindow.stopMovingWindow();
		moveComponentsToToasterMonitor();
	};

	return (
		<>
			<div onMouseDown={onmousedown} onMouseUp={onmouseup}>
				<DragHandleIcon className="drag-area" />
			</div>
			{activeNotifications(notifications).length > 0 && (
				<div id="notification-number">{activeNotifications(notifications).length}</div>
			)}
			<NotificationIcon
				className={notificationSubscribeMessage.showDrawer ? "toaster-icons--active" : "toaster-icons"}
				onClick={() => toggleDrawer()}
			/>
			<CenterIcon className="toaster-icons" onClick={toggleCenter} />
			{/* <div id="toaster-divider"></div>
			<SettingsIcon className="toaster-icons" /> */}
		</>
	);
}

export default App;
