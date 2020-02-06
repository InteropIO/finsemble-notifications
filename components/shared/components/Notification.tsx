import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import INotification from "../../../types/Notification-definitions/INotification";
import IAction from "../../../types/Notification-definitions/IAction";

interface Props {
	children?: React.PropsWithChildren<any>;
	notification: INotification;
	doAction: Function;
	closeAction?: Function;
}

const Notification = (props: Props) => {
	const { notification, doAction, closeAction } = props;
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
				<img src="../shared/assets/close.svg" id="close-icon" onClick={()=>closeAction()}/>
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
