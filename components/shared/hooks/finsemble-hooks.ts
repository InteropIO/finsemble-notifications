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

const getWindowSpawnData = () => WindowClient.getSpawnData();

/**
 * send a message over the router to toggle a component
 */
function toggleComponent() {
	// see if the component is in the active descriptors if not it will need loading or some other feedback
	// do we want to show minimize / hide in the case of the center?
	// send a message over the router with the word toggle and then the component can do a !toggle to show or do
	const { windowName, uuid, componentType } = WindowClient.getWindowIdentifier();
}

const bringWindowToFront: Function = () => WindowClient.bringWindowToFront();

export { toggleComponent, getWindowSpawnData, usePubSub, bringWindowToFront };

export default { toggleComponent, getWindowSpawnData, usePubSub, bringWindowToFront };
