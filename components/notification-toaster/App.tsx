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
	const [toasterMonitor, setToasterMonitor] = useState("primary");
	const { notifications, activeNotifications } = useNotifications();
	const pubSubTopic = "notification-ui";
	const [notificationSubscribeMessage, notificationsPublish] = usePubSub(pubSubTopic);

	useEffect(() => {
		const hotkey = _get(FSBL.Clients.WindowClient.getSpawnData(), "notifications.hotkey", null);
		console.log(hotkey);
		// TODO: Pull this out of the component into a hook
		if (hotkey) {
			FSBL.Clients.HotkeyClient.addGlobalHotkey(hotkey, () => {
				FSBL.Clients.WindowClient.showAtMousePosition();
			});
		}
		return () => {
			// cleanup;
		};
	}, []); // eslint-disable-line

	// show or hide the notification-drawer
	const toggleDrawer = () => {
		const { showDrawer } = notificationSubscribeMessage;
		const publishValue = { ...notificationSubscribeMessage };
		publishValue.showDrawer = !showDrawer;
		// send a message over the router like "{...,showDrawer:true}"
		notificationsPublish(publishValue);
	};

	// Show or hide the notification-center
	// use this to use the buttons to either be highlighted
	const toggleCenter = async () => {
		const { showCenter = true } = notificationSubscribeMessage;
		const publishValue = { ...notificationSubscribeMessage };
		publishValue["showCenter"] = !showCenter;

		// check if the center has been launched if not then launch it
		const { data: windows }: any = await FSBL.Clients.LauncherClient.getActiveDescriptors();
		if ("notification-center" in windows) {
			// send a message over the router like "{...,showCenter:true}"
			notificationsPublish(publishValue);
		} else {
			await FSBL.Clients.LauncherClient.spawn("notification-center", {});
		}
	};

	const setCurrentMonitor = () => {
		const monitorCallBack: StandardCallback = (err, monitorInfo) => {
			if (!err) {
				//  if monitor changed, publish the new monitor
				if (toasterMonitor !== monitorInfo.whichMonitor) {
					const publishValue = { ...notificationSubscribeMessage };
					publishValue["toasterMonitor"] = monitorInfo.whichMonitor;
					setToasterMonitor(monitorInfo.whichMonitor);
					notificationsPublish(publishValue);
				}
			}
		};

		FSBL.Clients.LauncherClient.getMonitorInfo({ monitor: "mine" }, monitorCallBack);
		return;
	};

	const onmousedown = (e: any) => {
		FSBL.Clients.WindowClient.startMovingWindow(e.nativeEvent);
	};
	const onmouseup = () => {
		FSBL.Clients.WindowClient.stopMovingWindow();
		setCurrentMonitor();
	};

	return (
		<>
			<div onMouseDown={onmousedown} onMouseUp={onmouseup}>
				<DragHandleIcon id="drag-area" className="drag-area" />
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
