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

	useEffect(() => {
		const resizeDrawerHeight = async () => {
			const monitorInfo = await FSBL.Clients.LauncherClient.getMonitorInfo({ monitor: "primary" });
			const { height } = _get(monitorInfo, "data.availableRect", null);
			// windowShowParams are either set via config or have some defaults at the parent level
			windowShowParams.height = Math.ceil(inputEl.current.getBoundingClientRect().height);
			windowShowParams.height < height && setNotificationDrawerPosition(windowShowParams);
		};

		const notificationListIsEmpty = notifications.length === 0;

		notificationListIsEmpty ? hideWindow() : resizeDrawerHeight();
	}, [notifications]);

	return (
		<div id="toasts-drawer" ref={inputEl}>
			{props.children}
		</div>
	);
}

export default Drawer;
