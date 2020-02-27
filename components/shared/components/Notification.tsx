import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import INotification from "../../../types/Notification-definitions/INotification";
import IAction from "../../../types/Notification-definitions/IAction";

interface Props {
	children?: React.PropsWithChildren<any>;
	notification: INotification;
	doAction: Function;
	closeAction?: Function;
	closeButton?: boolean;
}

// TODO: split this up into smaller components?

const Notification = (props: Props) => {
	const { useEffect, useState } = React;
	const { notification, doAction, closeAction, closeButton = false } = props;
	const {
		id,
		issuedAt = new Date(),
		type,
		title,
		details,
		headerText,
		headerLogo,
		contentLogo,
		actions,
		timeout,
		meta,
		actionsHistory
	} = notification;

	const [time, setTime] = useState(
		formatDistanceToNow(new Date(issuedAt), {
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
		}, 10000);
		return () => clearInterval(id);
	});

	return (
		<div className={`notification ${(meta && meta.cssClassName) || ""}`}>
			<div className="detail-area">
				<div>
					<img src={headerLogo} />
				</div>
				<div className="detail-area_type">{type}</div>
				<div className="detail-area_time">{time} ago</div>
				{closeButton && <img src="../shared/assets/close.svg" id="close-icon" onClick={() => closeAction()} />}
			</div>
			<div className="content-area">
				<div>
					<img src={contentLogo} />
				</div>
				<div>
					{/* TODO: remove this section */}
					<p>{details}</p>
					<p>
						<i>Message ID:{id}</i>
					</p>
				</div>
			</div>
			<hr />
			<div className="action-area">
				{actions.map((action: IAction) => (
					<button key={action.buttonText} onClick={() => doAction(notification, action)}>
						{action.buttonText}
					</button>
				))}
			</div>
		</div>
	);
};

export default Notification;
