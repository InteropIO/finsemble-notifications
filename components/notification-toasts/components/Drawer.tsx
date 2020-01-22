import * as React from "react";
import useNotifications from "../../shared/hooks/useNotifications";
import INotification from "../../../types/Notification-definitions/INotification";
import { SpawnParams } from "../../../types/FSBL-definitions/services/window/Launcher/launcher";

const { useEffect, useRef } = React;

interface Props {
	children: React.PropsWithChildren<any>;
	notifications?: INotification[];
	windowShowParams: SpawnParams;
}

function Drawer(props: Props): React.ReactElement {
	const { setNotificationDrawerPosition, minimizeWindow } = useNotifications();
	const inputEl = useRef(null);
	const { notifications, windowShowParams } = props;

	useEffect(() => {
		windowShowParams.height = inputEl.current.getBoundingClientRect().height;

		notifications.length === 0
			? minimizeWindow()
			: setNotificationDrawerPosition(windowShowParams);
	}, [notifications, setNotificationDrawerPosition]);

	return (
		<div id="toasts-drawer" ref={inputEl}>
			{props.children}
		</div>
	);
}

export default Drawer;
