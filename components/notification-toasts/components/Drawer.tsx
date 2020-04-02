import * as React from "react";
import useNotifications from "../../shared/hooks/useNotifications";
import INotification from "../../../types/Notification-definitions/INotification";
import { SpawnParams } from "../../../types/FSBL-definitions/services/window/Launcher/launcher";

const { useEffect, useLayoutEffect, useRef } = React;

interface Props {
	children: React.PropsWithChildren<any>;
	notifications?: INotification[];
	windowShowParams: SpawnParams;
}

function Drawer(props: Props): React.ReactElement {
	const {
		notifications,
		setNotificationDrawerPosition,
		minimizeWindow
	} = useNotifications();
	const inputEl = useRef(null);
	const { windowShowParams } = props;

	useLayoutEffect(() => {
		const test = async () => {
			windowShowParams.height = inputEl.current.getBoundingClientRect().height;

			notifications.length === 0
				? await minimizeWindow()
				: await setNotificationDrawerPosition(windowShowParams);
		};
		test();
	}, [
		minimizeWindow,
		notifications,
		setNotificationDrawerPosition,
		windowShowParams
	]);

	return (
		<div id="toasts-drawer" ref={inputEl}>
			{props.children}
		</div>
	);
}

export default Drawer;
