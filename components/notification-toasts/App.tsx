import * as React from "react";
import Drawer from "./components/Drawer";
import Notification from "../shared/components/Notification";
import useNotifications from "../shared/hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import Animate from "../shared/components/Animate";
import { SpawnParams } from "services/window/Launcher/launcher";
import { usePubSub } from "../shared/hooks/finsemble-hooks";
import { useState } from "react";
/* eslint-disable @typescript-eslint/no-var-requires */
const _get = require("lodash.get");
const { useEffect } = React;

const WINDOW_NAME_TOASTER = "notification-toaster";

function App(): React.ReactElement {
	const [currentMonitor, setCurrentMonitor] = useState("0");
	const {
		notifications,
		doAction,
		removeNotification,
		getNotificationConfig,
		activeNotifications,
		notificationIsActive,
		setOpaqueClassName
	} = useNotifications();

	const pubSubTopic = "notification-ui";
	const [notificationSubscribeMessage, notificationsPublish] = usePubSub(pubSubTopic);

	const config = getNotificationConfig();

	const windowShowParams: SpawnParams = _get(config, "config.position", {
		bottom: 0,
		right: 0,
		monitor: 0
	});

	// ensure the config and notifications have loaded before rendering the DOM
	const ready = config && notifications;

	const moveToMonitor = async () => {
		const { err, data } = (await FSBL.Clients.LauncherClient.getMonitorInfo({
			windowIdentifier: { windowName: WINDOW_NAME_TOASTER }
		})) as any;

		if (err) {
			console.error(err);
			return;
		}

		const bounds = (await finsembleWindow.getBounds({})) as any;
		const width = bounds.data.right - bounds.data.left;

		finsembleWindow.setBounds(
			{
				top: data["availableRect"]["top"],
				left: data["availableRect"]["right"] - width,
				height: data["availableRect"]["height"],
				width: width
			},
			(err: any) => {
				if (err) {
					console.log(err);
				}
			}
		);
	};

	useEffect(() => {
		setOpaqueClassName(!config.isTransparent);
	}, []);

	useEffect(() => {
		if (
			currentMonitor !== notificationSubscribeMessage.toasterMonitorPosition &&
			!activeNotifications(notifications).length
		) {
			moveToMonitor().then(() => {
				setCurrentMonitor(notificationSubscribeMessage.toasterMonitorPosition);
			});
		}

		const rect = document.getElementById("toasts-drawer").getBoundingClientRect();
		if (notifications.length === 0) {
			if (config.isTransparent) {
				const roundedRect = {
					x: Math.round(rect.x),
					y: Math.round(rect.y),
					width: 1,
					height: 1
				};
				FSBL.Clients.WindowClient.setShape([roundedRect]);
			} else {
				finsembleWindow.hide();
			}
		} else {
			finsembleWindow.bringToFront();
			if (config.isTransparent) {
				const roundedRect = {
					x: Math.round(rect.x),
					y: Math.round(rect.y),
					width: Math.round(rect.width),
					height: Math.round(rect.height)
				};
				FSBL.Clients.WindowClient.setShape([roundedRect]);
			} else {
				finsembleWindow.show({}, async () => {
					const { err, data } = (await FSBL.Clients.LauncherClient.getMonitorInfo({ monitor: "mine" })) as any;

					if (err) {
						console.error(err);
						return;
					}

					const bounds = (await finsembleWindow.getBounds({})) as any;
					const width = bounds.data.right - bounds.data.left;
					const height = Math.round(rect.height) + 6;

					finsembleWindow.setBounds(
						{
							top: data["availableRect"]["bottom"] - height,
							left: data["availableRect"]["right"] - width,
							height: height,
							width: width
						},
						(err: any) => {
							if (err) {
								console.error(err);
							}
						}
					);
				});
			}
		}
	}, [notifications, notificationSubscribeMessage]);

	return (
		<Drawer notifications={notifications} windowShowParams={windowShowParams}>
			{ready &&
				notifications.map(
					(notification: INotification) =>
						notificationIsActive(notification) && (
							// TODO: Recommend to change this to react transition group
							<Animate
								key={notification.id}
								displayDuration={notification.timeout || config.animation.displayDuration}
								animateIn={config.animation.animateIn}
								animateOut={config.animation.animateOut}
								animateOutComplete={() => removeNotification(notification)}
							>
								<Notification
									key={notification.id}
									notification={notification}
									doAction={doAction}
									closeAction={() => removeNotification(notification)}
									closeButton
									overflowCount={3}
								/>
							</Animate>
						)
				)}
		</Drawer>
	);
}

export default App;
