import * as React from "react";
import useNotifications from "../../shared/hooks/useNotifications";
import INotification from "../../../types/Notification-definitions/INotification";
import { SpawnParams } from "../../../types/FSBL-definitions/services/window/Launcher/launcher";

const _get = require("lodash.get");

const { useEffect, useState, useRef } = React;

interface Props {
	children: React.PropsWithChildren<any>;
	notifications?: INotification[];
	windowShowParams: SpawnParams;
}

function Drawer(props: Props): React.ReactElement {
	const {
		setNotificationDrawerPosition,
		minimizeWindow,
	} = useNotifications();
	const inputEl = useRef(null);
	const { windowShowParams, notifications } = props;
	const [monitor, setMonitor] = useState(null);

	useEffect(() => {
		const test = async () => {
			if (!monitor) {
				const monitorInfo = await FSBL.Clients.LauncherClient.getMonitorInfo({
					monitor: "primary"
				});
				setMonitor(monitorInfo);
			}
			const { height } = _get(monitor, "data.availableRect", 3000);

			windowShowParams.height = 145 * notifications.length;
			windowShowParams.width =
				FSBL.Clients.WindowClient.options.customData.window.width;

			if (windowShowParams.height === 0) {
				windowShowParams.height = 1;
				windowShowParams.width = 1;
			}

			if(windowShowParams.height > height) {
				windowShowParams.height = height;
			}

			await setNotificationDrawerPosition(windowShowParams); // sets the window size / height
		};
		test();
	}, [
		minimizeWindow,
		notifications,
		setNotificationDrawerPosition,
		windowShowParams,
	]);

	return (
		<div id="toasts-drawer" ref={inputEl}>
			{props.children}
		</div>
	);
}

export default Drawer;