import * as React from "react";
import INotification from "../../../types/Notification-definitions/INotification";
import IAction from "../../../types/Notification-definitions/IAction";
import Meta from "../../../types/Notification-definitions/Meta";
import { formatDistanceToNow } from "date-fns";

interface NotificationHeaderProps {
	issuedAt?: string;
	receivedAt?: string;
	headerLogo?: string;
	headerText?: string;
}

interface NotificationContentProps {
	title?: string;
	type?: string;
	contentLogo?: string;
	details?: string;
	timeout?: number;
	meta?: Meta;
	isRead?: boolean;
	isSnoozed?: boolean;
}

interface NotificationActionsProps {
	actions?: IAction[];
	doAction?: Function;
}

interface NotificationPanelProps {
	children?: React.PropsWithChildren<any>;
	notification?: INotification;
	clearActiveNotification?: Function;
	doAction?: Function;
}

const HeaderArea = (props: NotificationHeaderProps) => {
	const { useState, useEffect } = React;
	const { issuedAt, receivedAt, headerLogo, headerText } = props;

	const [issuedTime, setTime] = useState(
		formatDistanceToNow(new Date(issuedAt), {
			includeSeconds: true
		})
	);

	const [receivedTime, setReceived] = useState(
		formatDistanceToNow(new Date(receivedAt), {
			includeSeconds: true
		})
	);

	useEffect(() => {
		const id = setInterval(() => {
			setTime(
				formatDistanceToNow(new Date(issuedAt), {
					includeSeconds: true
				})
			);
			setReceived(
				formatDistanceToNow(new Date(receivedAt), {
					includeSeconds: true
				})
			);
		}, 10000);
		return () => clearInterval(id);
	});

	return (
		<div className="card_header">
			<div className="notification_logo">
				<img src={headerLogo} />
				<div>{headerText}</div>
			</div>
			<div className="issued_at">Issued: {issuedTime}</div>
			<div className="received_at">Recieved: {receivedTime}</div>
		</div>
	);
};

const ContentArea = (props: NotificationContentProps) => {
	const { title, type, contentLogo, details, timeout, meta, isRead, isSnoozed } = props;

	return (
		<div className="details">
			<h4 className="title">{title}</h4>
			<div className="type">Notification Type: {type}</div>
			<div className="notification_content">
				<img src={contentLogo} />
				<div>{details}</div>
			</div>
			<div className="meta-details">
				{/* <div>{meta}</div> */}
				<div className="timeout">Notification Timeout: {timeout}</div>
				<div className="flags">
					<div>Viewed: {isRead}</div>
					<div>Snoozed: {isSnoozed}</div>
				</div>
			</div>
		</div>
	);
};

const ActionsArea = (props: NotificationActionsProps) => {
	const { actions } = props;

	return (
		<div className="actions">
			{actions.map((action: IAction, i: number) => {
				return (
					<div key={i} onClick={() => props.doAction(props, action)}>
						{action.buttonText}
					</div>
				);
			})}
		</div>
	);
};

const NotificationsPanel = (props: NotificationPanelProps) => {
	const { notification } = props;
	const {
		id,
		issuedAt,
		receivedAt,
		type,
		source,
		title,
		details,
		headerText,
		headerLogo,
		contentLogo,
		actions,
		timeout,
		meta,
		isRead,
		isSnoozed,
		actionsHistory,
		stateHistory
	} = notification;

	return (
		<section id="notification-center__notification-detail">
			<h3>
				Notification Detail:{" "}
				<img src="../shared/assets/close.svg" id="close-icon" onClick={() => props.clearActiveNotification(null)} />
			</h3>
			<div className="notification_card" title={id}>
				<HeaderArea {...notification} />
				<ContentArea {...notification} />
				<ActionsArea {...notification} />
			</div>
		</section>
	);
};

export default NotificationsPanel;
