import * as React from "react";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import { INotification } from "common/notifications/definitions/INotification";
import Animate from "../shared/components/Animate";
import { CSSTransition } from "react-transition-group";
import CenterIcon from "../shared/components/icons/CenterIcon";
import SlideRightIcon from "../shared/components/icons/SlideRightIcon";
import { usePubSub, overflowMenuClick } from "../shared/hooks/finsemble-hooks";
import ConditionalWrapper from "../shared/components/ConditionalWrapper";

const { useState, useEffect } = React;

const HideDrawer = ({ onClick }: { onClick: Function }) => (
	<SlideRightIcon className="hide-icon" onClick={() => onClick()}>
		<title>hide drawer</title>
	</SlideRightIcon>
);

function App(): React.ReactElement {
	const {
		notifications,
		doAction,
		notificationIsActive,
		getNotificationConfig,
		setOpaqueClassName
	} = useNotifications();
	const pubSubTopic = "notification-ui";
	const [notificationSubscribeMessage, notificationsPublish] = usePubSub(pubSubTopic);

	const config = getNotificationConfig();

	const [showDrawer, setShowDrawer] = useState(false);

	useEffect(() => {
		setOpaqueClassName(!config.isTransparent);
	}, []);

	const overflowClick = (event: React.MouseEvent, data: any) => {
		overflowMenuClick(event, { ...data, notificationSubscribeMessage, notificationsPublish });
	};

	const toggleDrawer = (show: boolean, isTransparent: boolean) => {
		if (isTransparent) {
			const rect = document.getElementById("notifications-drawer")?.getBoundingClientRect();
			if (show) {
				const roundedRect = {
					x: Math.round(rect?.x as number),
					y: Math.round(rect?.y as number),
					width: Math.round(rect?.width as number),
					height: Math.round(rect?.height as number)
				};
				FSBL.Clients.WindowClient.setShape([roundedRect]);
			} else {
				const roundedRect = {
					x: 0,
					y: 0,
					width: 1,
					height: 1
				};
				setTimeout(() => {
					FSBL.Clients.WindowClient.setShape([roundedRect]);
				}, 500);
			}
		} else {
			if (show) {
				finsembleWindow.show({});
			} else {
				finsembleWindow.hide();
			}
		}
	};

	useEffect(() => {
		setShowDrawer(notificationSubscribeMessage.showDrawer);
		toggleDrawer(notificationSubscribeMessage.showDrawer, config.isTransparent as boolean);
	}, [notificationSubscribeMessage.showDrawer, config.isTransparent]);

	const closeDrawerClick = () => {
		const publishValue = { ...notificationSubscribeMessage };
		publishValue["showDrawer"] = false;
		notificationsPublish(publishValue);
	};

	const toggleCenter = () => {
		const publishValue = { ...notificationSubscribeMessage };
		publishValue["showCenter"] = !publishValue["showCenter"];
		notificationsPublish(publishValue);
	};

	return (
		<ConditionalWrapper
			condition={config.isTransparent as boolean}
			wrapper={children => (
				<CSSTransition in={showDrawer} timeout={500} classNames="drawer" unmountOnExit>
					{children}
				</CSSTransition>
			)}
		>
			<Drawer>
				<div id="notifications-drawer__menu">
					<CenterIcon id="notification-center-icon" className="notification-center-icon" onClick={toggleCenter}>
						<title>Notification Center</title>
					</CenterIcon>
					<HideDrawer onClick={closeDrawerClick} />
				</div>
				<div>
					{notifications.length ? (
						[...notifications].map(
							(notification: INotification) =>
								notificationIsActive(notification) && (
									<Animate animateIn="slide-in-fwd-bottom" animateOut="slide-out-right" key={notification.id}>
										<Notification
											notification={notification}
											overflowMenuAction={overflowClick}
											doAction={doAction}
											overflowCount={3}
										/>
									</Animate>
								)
						)
					) : (
						<p className="empty-notifications">You do not have any notifications!</p>
					)}
				</div>
			</Drawer>
		</ConditionalWrapper>
	);
}

export default App;
