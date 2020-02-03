import * as React from "react";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import "./notification-icon.css";
const { useState, useEffect } = React;
interface Props {
	action: Function;
}

function App(props: Props): React.ReactElement {
	const [activeNotifications, setActiveNotifications] = useState([]);
	const { notifications, groupNotificationsByType } = useNotifications();

	const { action } = props;

	useEffect(() => {
		const currentNotifications = notifications.filter(
			(notification: INotification) =>
				!notification.isSnoozed && !notification.isActionPerformed
		);
		setActiveNotifications(currentNotifications);
	}, [notifications]);

	const iconAction = () => {
		// action || null;
		window.FSBL.Clients.LauncherClient.showWindow(
			{ windowName: "", componentType: "notification-drawer" },
			{},
			console.log
		);
	};

	return (
		<>
			<span id="notification-icon_vector" onClick={iconAction}>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
				</svg>
			</span>
			<div id="notification-icon__wrapper">
				{Object.entries(groupNotificationsByType(activeNotifications)).map(
					([key, values]) => {
						console.log(key, values);
						const colors = {
							chat: "#8b00c596",
							email: "#005bc5",
							timed: "#818400"
						};
						return (
							<div
								className="notification-number"
								style={{ backgroundColor: colors[key] }}
								key={key}
							>
								{values.length}
							</div>
						);
					}
				)}
			</div>
		</>
	);
}

export default App;
