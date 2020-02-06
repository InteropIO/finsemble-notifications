import * as React from "react";
import INotification from "../../../types/Notification-definitions/INotification";

interface Props {
	children?: React.PropsWithChildren<any>;
	notification?: INotification;
	clearActiveNotification?: Function;
}

const NotificationsPanel = (props: Props) => {
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
		isActionPerformed,
		isSnoozed,
		actionsHistory,
		stateHistory
	} = props.notification;
	return (
		<section id="notification-center__notification-detail">
			<h3>
				Notification Detail:{" "}
				<img
					src="../shared/assets/close.svg"
					id="close-icon"
					onClick={() => props.clearActiveNotification(null)}
				/>
			</h3>

			<p>ID: {id}</p>
			<p>Issued: {issuedAt}</p>
			<p>Received: {receivedAt}</p>
			<p>Type: {type}</p>
			<p>Source: {source}</p>
			<p>Title: {title}</p>
			<p>Details: {details}</p>
			<p>Header: {headerText}</p>
			<p>Logo: {headerLogo}</p>
			<p>Content Image: {contentLogo}</p>
			{/* <p> {actions}</p> */}
			<p>Time out after: {timeout}</p>
			{/* <p>Meta: {meta}</p> */}
			<p>Action has been performed: {isActionPerformed}</p>
			<p>Notification is snoozed: {isSnoozed}</p>
			{/* <p> {actionsHistory}</p> */}
			{/* <p> {stateHistory}</p> */}
		</section>
	);
};

export default NotificationsPanel;
