import * as React from "react";
import INotification from "../../../types/Notification-definitions/INotification";
import { getDate } from "date-fns";

interface Props {
	children?: React.PropsWithChildren<any>;
	notifications: Array<INotification>;
	setActiveNotification: Function;
}

const NotificationsPanel = (props: Props) => (
	<section id="notification-center__notifications">
		<div className="notification-center__notifications__rows">
			<div>ID</div>
			<div>Title</div>
			<div>Details</div>
			<div>Created</div>
			<div>Type</div>
		</div>

		{props.notifications.map((notification: INotification) => (
			<div
				className="notification-center__notifications__rows"
				key={notification.id}
				onClick={() => props.setActiveNotification(notification)}
			>
				<div>{notification.id}</div>
				<div>{notification.headerText} </div>
				<div>{notification.details} </div>
				<div>{notification.issuedAt || getDate(new Date())} </div>
				<div>{notification.type || "any"} </div>
			</div>
		))}
	</section>
);

export default NotificationsPanel;
