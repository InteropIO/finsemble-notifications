import * as React from "react";
import INotification from "../../../types/Notification-definitions/INotification";
import { format, parseISO } from "date-fns";
import { ActionTypes } from "../../../services/notification/notificationClient";
import Action from "../../../types/Notification-definitions/Action";

interface TableProps {
	children?: React.PropsWithChildren<any>;
	notifications: Array<INotification>;
	setActiveNotification: Function;
	doAction: Function;
	markUnread: Function;
}

interface RowProps {
	notification?: INotification;
	selected: any;
	setActiveNotification: Function;
}

const NotificationRow = (props: RowProps) => {
	const { useState } = React;
	const { notification } = props;

	const [expandedField, toggleIdField] = useState(false);

	const idClass = expandedField ? null : "id";

	return (
		<div
			className="notification-center__notifications__rows"
			key={notification.id}
			onClick={() => props.setActiveNotification(notification)}
		>
			<div>
				<input
					id={`check-${notification.id}`}
					type="checkbox"
					onChange={() => {
						const checkbox = document.getElementById(`check-${notification.id}`) as HTMLInputElement;
						if (checkbox.checked) {
							const ids = Object.keys(props.selected);
							if (!ids.includes(notification.id)) {
								props.selected[notification.id] = notification;
							}
						} else {
							if (props.selected.hasOwnProperty(notification.id)) {
								delete props.selected[notification.id];
							}
						}
					}}
				></input>
			</div>
			<div
				className={idClass}
				title={notification.id}
				onMouseOver={() => toggleIdField(!expandedField)}
				onMouseLeave={() => toggleIdField(!expandedField)}
			>
				{notification.id}
			</div>
			<div>{notification.title} </div>
			<div>{notification.headerText} </div>
			<div>{format(parseISO(notification.issuedAt), "yyyy-MM-dd' at 'HH:mm:ss")}</div>
			<div>{notification.type} </div>
			<div>{notification.isRead ? <span>✓</span> : null}</div>
		</div>
	);
};

const NotificationsPanel = (props: TableProps) => {
	const { useState } = React;
	const { setActiveNotification, doAction, markUnread } = props;

	const [selected] = useState({});

	return (
		<section id="notification-center__notifications">
			<div className="action_buttons">
				<div
					title="Mark Unread"
					onClick={() => {
						markUnread(Object.values(selected));
					}}
				>
					Mark Unread
				</div>
				<div
					title="Mark Read"
					onClick={() => {
						const dismiss = new Action();
						dismiss.type = ActionTypes.DISMISS;
						const selectedNotifications = Object.values(selected);
						selectedNotifications.forEach(noti => {
							doAction(noti, dismiss);
						});
					}}
				>
					Mark Read
				</div>
			</div>
			<div className="notification-center__notifications__rows">
				<h4>Select</h4>
				<h4>ID</h4>
				<h4>Title</h4>
				<h4>Header Text</h4>
				<h4>Created</h4>
				<h4>Type</h4>
				<h4>Read</h4>
			</div>

			{props.notifications.map((notification: INotification, i: number) => (
				<NotificationRow
					key={i}
					notification={notification}
					setActiveNotification={setActiveNotification}
					selected={selected}
				/>
			))}
		</section>
	);
};

export default NotificationsPanel;
