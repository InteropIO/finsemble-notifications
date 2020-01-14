import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import INotification from "../../../types/Notification-definitions/INotification";
import IAction from "../../../types/Notification-definitions/IAction";

interface Props {
	children?: React.PropsWithChildren<any>;
	notification: INotification;
	doAction: Function;
}

const Notification = (props: Props) => {
	const { notification, doAction } = props;
	const {
		id,
		issuedAt = new Date(),
		type,
		title,
		details,
		headerText,
		headerLogo = "https://lsloz.csb.app/notifications.svg",
		contentLogo = "https://si.wsj.net/public/resources/images/IF-AC796_JUNKST_GR_20161103121700.jpg",
		actions,
		timeout,
		meta,
		actionsHistory
	} = notification;

	return (
		<div className="notification">
			<div className="detail-area">
				<div>
					<img src={headerLogo} />
				</div>
				<div className="detail-area_type">{type}</div>
				<div className="detail-area_time">
					{formatDistanceToNow(new Date(issuedAt), {
						includeSeconds: true
					})}{" "}
					ago
				</div>
				{/* <div>^</div> */}
			</div>
			<div className="content-area">
				<div>
					<img src={contentLogo} />
				</div>
				<div>
					<p>{details}</p>
					<p>
						<i>Message ID:{id}</i>
					</p>
				</div>
			</div>
			<hr />
			<div className="action-area">
				{actions.map((action: IAction) => (
					<button
						key={action.buttonText}
						onClick={() => doAction(notification, action)}
					>
						{action.buttonText}
					</button>
				))}
			</div>
		</div>
	);
};

export default Notification;
