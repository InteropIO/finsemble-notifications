import * as React from "react";

const { useState, useEffect } = React;

const { WindowClient, RouterClient } = FSBL.Clients;

const { publish, subscribe, unsubscribe } = RouterClient;

function usePubSub(topic: string, initialMessage: object = {}): [{ [key: string]: any }, Function] {
	const [message, setMessage] = useState(initialMessage);

	const pub = (value: any) => publish(topic, value);

	useEffect(() => {
		const subscribeId = subscribe(topic, (err, res) => {
			if (err) console.error(err);
			// console.log(res);
			setMessage(res.data);
		});
		return () => {
			unsubscribe(subscribeId);
		};
	}, []);

	return [message, pub];
}

const overflowMenuClick = (event: React.MouseEvent, params: any) => {
	const { notification, notificationSubscribeMessage, notificationsPublish, overflowCount } = params;
	event.persist();
	finsembleWindow.getBounds({}, (err: any, data: any) => {
		const clickCoordinates = {
			left: data.left + event.clientX,
			top: data.top + event.clientY
		};

		const publishValue = { ...notificationSubscribeMessage };
		publishValue["overFlowMenu"] = {
			notification,
			clickCoordinates,
			overflowCount
		};
		notificationsPublish(publishValue);
	});
};

const getWindowSpawnData = () => WindowClient.getSpawnData();

const bringWindowToFront: Function = () => WindowClient.bringWindowToFront();

export { getWindowSpawnData, usePubSub, bringWindowToFront, overflowMenuClick };

export default { getWindowSpawnData, usePubSub, bringWindowToFront, overflowMenuClick };
