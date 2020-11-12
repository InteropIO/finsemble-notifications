import * as React from "react";
import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from "react";
import UIAction from "../shared/components/UIAction";
import useNotifications from "../shared/hooks/useNotifications";
import IMuteFilter from "common/notifications/definitions/IMuteFilter";
import { usePubSub } from "../shared/hooks/finsemble-hooks";
import { INotification } from "common/notifications/definitions/INotification";
import SettingsIcon from "../shared/components/icons/Settings";
import IAction from "common/notifications/definitions/IAction";
import CloseIcon from "../shared/components/icons/CloseIcon";

type CheckboxProps = {
	isActive: boolean;
};

const FSBLCheckbox = (props: CheckboxProps) => {
	return (
		<div className={"inline-checkbox" + (props.isActive ? " active" : "")} title="">
			<div className={"checkbox" + (props.isActive ? " active" : "")}>
				<div className={"checkbox-background" + (props.isActive ? " active" : "")} />
			</div>
		</div>
	);
};

type MuteProps = {
	muteFilters: IMuteFilter[];
	filter: IMuteFilter;
	toggleMute: ChangeEventHandler;
};

const MuteOption = (props: MuteProps) => {
	const { muteFilters, toggleMute, filter } = props;
	const isFilterInList = (): boolean => {
		let inList = false;
		for (const muteFilter of muteFilters) {
			// If it has both, both need to match
			if (filter.source && filter.type) {
				inList = muteFilter.source === filter.source && muteFilter.type === filter.type;
			} else if (filter.source && !filter.type && !muteFilter.type) {
				inList = muteFilter.source === filter.source;
			} else if (filter.type && !filter.source && !muteFilter.source) {
				inList = muteFilter.type === filter.type;
			}

			if (inList) {
				return inList;
			}
		}
		return inList;
	};

	let message = "";

	if (filter.type && filter.source) {
		message = `Mute '${filter.type}' type notifications from '${filter.source}'`;
	} else if (filter.source) {
		message = `Mute notifications from '${filter.source}'`;
	} else if (filter.type) {
		message = `Mute '${filter.type}' type notifications`;
	}

	return (
		<>
			<label className="mute-option">
				<FSBLCheckbox isActive={isFilterInList()} />
				<input
					type="checkbox"
					onChange={toggleMute}
					data-notification-source={filter.source ? filter.source : null}
					data-notification-type={filter.type ? filter.type : null}
					checked={isFilterInList()}
				/>
				<span>{message}</span>
			</label>
		</>
	);
};

function App(): React.ReactElement {
	const [muteFilters, setMuteFilters] = useState([]);
	const { doAction, mute, unmute, getNotificationConfig, setOpaqueClassName } = useNotifications();

	const [notification, setNotification] = useState() as [INotification, Function];
	const [overflowCount, setOverflowCount] = useState(9001);
	const [settingsOpen, setOpenState] = useState(true);

	const pubSubTopic = "notification-ui";
	const [notificationSubscribeMessage] = usePubSub(pubSubTopic);

	const config = getNotificationConfig();

	const hide = () => {
		setOpenState(false);
		finsembleWindow.hide();
	};

	const doActionAndHide = (notification: INotification, action: any) => {
		doAction(notification, action);
		hide();
	};

	const toggleMute = async (event: React.ChangeEvent) => {
		const target = event.target as HTMLInputElement;
		const filter: IMuteFilter = {};

		if (target.dataset.notificationSource) {
			filter.source = target.dataset.notificationSource;
		}

		if (target.dataset.notificationType) {
			filter.type = target.dataset.notificationType;
		}

		if (target.checked) {
			await mute(filter);
		} else {
			await unmute(filter);
		}
	};

	const toggleSettings = () => {
		setOpenState(!settingsOpen);
		requestAnimationFrame(() => {
			FSBL.Clients.WindowClient.fitToDOM();
		});
	};

	const applyConfigChange = (err: any, config: any) => {
		if (config) {
			// configClient.getValue() and configClient.addListener return different formats
			if (config.value) {
				config = config.value;
			}
			setMuteFilters(config);
		}
	};

	useEffect(() => {
		finsembleWindow.addEventListener("blurred", hide);
		FSBL.Clients.ConfigClient.addListener({ field: "finsemble.notifications.mute" }, applyConfigChange);
		FSBL.Clients.ConfigClient.getValue({ field: "finsemble.notifications.mute" }, applyConfigChange);
		setOpaqueClassName(!config.isTransparent);

		return () => {
			finsembleWindow.removeEventListener("blurred", hide);
			FSBL.Clients.ConfigClient.removeListener({ field: "finsemble.notifications.mute" }, applyConfigChange);
		};
	}, []);

	useEffect(() => {
		const { overFlowMenu } = notificationSubscribeMessage;
		const overflowNotification = overFlowMenu?.notification;
		const clickCoordinates = overFlowMenu?.clickCoordinates ? overFlowMenu.clickCoordinates : {};
		const count = overFlowMenu?.overflowCount ? overFlowMenu.overflowCount : false;
		setOverflowCount(count);

		if (overflowNotification && clickCoordinates) {
			finsembleWindow.show({});
			setNotification(overflowNotification);
			setOpenState(overflowNotification.actions.length <= count);
			// Fit to dom was sometimes being called before the UI update happened. (I believe requestAnimationFrame is
			// a decent method of waiting for that to complete)
			window.requestAnimationFrame(async () => {
				FSBL.Clients.WindowClient.fitToDOM({}, async () => {
					// @ts-ignore
					const { data: bounds } = await finsembleWindow.getBounds({});
					// @ts-ignore
					const { data: monitorData } = await FSBL.Clients.LauncherClient.getMonitorInfo({}, null);
					finsembleWindow.setBounds(
						{
							bounds: {
								height: bounds.height,
								width: bounds.width,
								top: Math.max(clickCoordinates.top - bounds.height, monitorData.availableRect.top),
								left: clickCoordinates.left - bounds.width
							}
						},
						async () => {
							// Occasionally the overflow menu would not appear above toasts, lose focus and close
							// (not convinced this fixes it)
							finsembleWindow.bringToFront();
							finsembleWindow.focus();
							finsembleWindow.bringToFront();
						}
					);
				});
			});
		}
	}, [JSON.stringify(notificationSubscribeMessage.overFlowMenu)]);

	const actions = notification?.actions;

	return (
		<>
			{notification && (
				<>
					<div className="notification-overflow-menu-header">
						<div className="close">
							<CloseIcon className="close-icon" onClick={() => hide()} />
						</div>
					</div>
					{actions &&
						actions.length > overflowCount &&
						actions.map((action: IAction, index: number) => {
							if (index + 1 > overflowCount) {
								return <UIAction key={index} doAction={doActionAndHide} notification={notification} action={action} />;
							}
						})}
					{(notification.source || notification.type) && (
						<div className="notification-settings">
							{actions && actions.length > overflowCount ? (
								<SettingsIcon
									onClick={toggleSettings}
									className={settingsOpen ? "settings-icons--active" : "settings-icons"}
								/>
							) : (
								""
							)}
							<div className={settingsOpen ? "mute-container--active" : "mute-container"}>
								{actions && actions.length > overflowCount && <hr />}
								{notification.source && (
									<MuteOption
										muteFilters={muteFilters}
										toggleMute={toggleMute}
										filter={{ source: notification.source }}
									/>
								)}
								{notification.type && (
									<MuteOption muteFilters={muteFilters} toggleMute={toggleMute} filter={{ type: notification.type }} />
								)}
								{notification.type && notification.source && (
									<MuteOption
										muteFilters={muteFilters}
										toggleMute={toggleMute}
										filter={{ source: notification.source, type: notification.type }}
									/>
								)}
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default App;
