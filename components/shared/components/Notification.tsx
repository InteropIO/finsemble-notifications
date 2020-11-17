import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { INotification } from "common/notifications/definitions/INotification";
import IAction from "common/notifications/definitions/IAction";
import CloseIcon from "../components/icons/CloseIcon";
import { useEffect, useState } from "react";
import UIAction from "./UIAction";

interface Props {
	children?: React.PropsWithChildren<any>;
	notification: INotification;
	doAction: Function;
	closeAction?: Function;
	closeButton?: boolean;
	onMouseLeave?: Function;
	onMouseEnter?: Function;
	overflowMenuAction: (event: React.MouseEvent, data: any) => void;
	overflowCount?: number;
}

const HeaderArea = (props: Props) => {
	const { closeAction, closeButton = false, notification } = props;
	const { issuedAt = new Date() } = notification;

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
		<div className="detail-area">
			<div>
				<img src={notification.headerLogo} />
			</div>
			<div className="detail-area_type">{notification.headerText}</div>
			<div className="detail-area_time">{time} ago</div>
			{closeButton && <CloseIcon className="close-icon" onClick={() => closeAction && closeAction()} />}
		</div>
	);
};

const ContentArea = (props: Props) => {
	const { notification } = props;

	return (
		<div className="content-area">
			<div>
				<img src={notification.contentLogo} />
			</div>
			<div>
				<h2>{notification.title}</h2>
				<p>{notification.details}</p>
			</div>
		</div>
	);
};

const ActionArea = (props: Props) => {
	const { notification, overflowCount } = props;

	const { actions } = notification;

	return (
		<div className="action-area">
			{notification.actions?.map((action: IAction, index) => {
				if (!overflowCount || index + 1 <= overflowCount) {
					return <UIAction key={index} {...props} action={action} />;
				}
			})}
			{((overflowCount && actions && actions.length > overflowCount) || notification.source || notification.type) && (
				<OverflowMenu {...props} />
			)}
		</div>
	);
};

interface OverflowMenuProps {
	notification: INotification;
	overflowMenuAction: Function;
	overflowCount?: number;
}

const OverflowMenu = (props: OverflowMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const open = (event: any) => {
		return props.overflowMenuAction(event, {
			notification: props.notification,
			overflowCount: props.overflowCount
		});
	};

	return (
		<div className={"action-overflow " + (isOpen ? "overflow-open" : "")}>
			<div className="overflow-icon">
				<span onClick={open}>...</span>
			</div>
		</div>
	);
};

const Notification = (props: Props) => {
	const { notification } = props;

	return (
		<div
			className={`notification ${notification.cssClassName || ""}`}
			onMouseEnter={() => props.onMouseEnter && props.onMouseEnter()}
			onMouseLeave={() => props.onMouseLeave && props.onMouseLeave()}
		>
			<HeaderArea {...props} />
			<ContentArea {...props} />
			<hr />
			<ActionArea {...props} />
		</div>
	);
};

export default Notification;
