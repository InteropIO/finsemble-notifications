import * as React from "react";
const _get = require("lodash.get");
import useNotifications from "../../shared/hooks/useNotifications";
import INotification from "../../../types/Notification-definitions/INotification";
import { SpawnParams } from "../../../types/FSBL-definitions/services/window/Launcher/launcher";

const { useEffect, useRef, useState } = React;

interface Props {
	children: React.PropsWithChildren<any>;
	notifications?: INotification[];
	windowShowParams: SpawnParams;
}

function Drawer(props: Props): React.ReactElement {
	const { setNotificationDrawerPosition, minimizeWindow: hideWindow } = useNotifications();
	const inputEl = useRef(null);
	const { notifications, windowShowParams } = props;
	const [monitor, setMonitor] = useState(null);
	useEffect(() => {
		const resizeDrawerHeight = async () => {
			if (!monitor) {
				const monitorInfo = await FSBL.Clients.LauncherClient.getMonitorInfo({
					monitor: "primary"
				});
				setMonitor(monitorInfo);
			}
			const { height: monitorHeight } = _get(monitor, "data.availableRect", 3000);
			const notificationHeight = 162;

			const { width } = FSBL.Clients.WindowClient.options.customData.window;

			windowShowParams.height = notificationHeight * notifications.length;
			windowShowParams.width = width;

			if (windowShowParams.height === 0) {
				windowShowParams.height = 1;
				windowShowParams.width = 1;
			}

			if (windowShowParams.height > monitorHeight) {
				windowShowParams.height = monitorHeight;
			}

			await setNotificationDrawerPosition(windowShowParams); // sets the window size / height
		};
		resizeDrawerHeight();
	}, [monitor, notifications, setNotificationDrawerPosition, windowShowParams]);

	return (
		<div id="toasts-drawer" ref={inputEl}>
			{props.children}
		</div>
	);
}

export default Drawer;
