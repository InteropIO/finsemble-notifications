import IAction from "common/notifications/definitions/IAction";
import { INotification } from "common/notifications/definitions/INotification";
import * as React from "react";

interface ActionUIProps {
	action: IAction;
	doAction: Function;
	notification: INotification;
}

const UIAction = (props: ActionUIProps) => {
	const { action, doAction, notification } = props;
	return (
		<button
			key={action.buttonText}
			onClick={e => {
				e.preventDefault();
				doAction(notification, action);
			}}
		>
			{action.buttonText}
		</button>
	);
};

export default UIAction;
