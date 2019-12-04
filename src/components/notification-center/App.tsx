import * as React from "react";
import { StoreProvider } from "./store/Store";
import Center from "./components/Center";
import Notification from "./components/Notification";
import { FSBL } from "../FSBL-definitions/globals";

const { useState } = React;

const App = () => {
	const [notifications, setNotifications] = useState([]);

	const removeNotification = (index: number) => {
		const notificationRemoved = [...notifications];
		notificationRemoved.splice(index);
		setNotifications(notificationRemoved);
	};

	return (
		<StoreProvider>
			<Center>
				{/* {notifications.map((notification: INotification, index) => (
					<Notification key={notification.id}>
						<img
							src="https://pbs.twimg.com/profile_images/842471270067380225/4AnZ2ryU_400x400.jpg"
							height="20px"
						/>
						<span>{notification.title}</span>
						<span>{notification.details}</span>
						<button
							onClick={() => {
								removeNotification(index);
							}}
						>
							dismiss
						</button>
						<button
							onClick={() => {
								console.log(notification.actions);
							}}
						>
							actions
						</button>
					</Notification>
				))}
				<button onClick={addNotifications}>Add another</button> */}
			</Center>
		</StoreProvider>
	);
};

export default App;
