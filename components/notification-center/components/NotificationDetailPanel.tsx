import * as React from "react";
import INotification from "../../../types/Notification-definitions/INotification";

interface Props {
	children?: React.PropsWithChildren<any>;
	notification?: INotification;
}

const NotificationsPanel = (props: Props) => (
	<section id="notification-center__notification-detail">
		<h3>Notification Detail:</h3>
		{props.notification &&
			Object.entries(props.notification).map(([key, value]) => (
				<>
					<p>
						{key}:{JSON.stringify(value)}
					</p>
				</>
			))}
	</section>
);

export default NotificationsPanel;
