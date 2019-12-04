import * as React from "react";
import { StoreProvider } from "./store/Store";
import Drawer from "./components/Drawer";
import Notification from "./components/Notification";
import useNotifications from "../hooks/useNotifications";

const { useState } = React;

function App(): React.ReactElement {
	const { notifications } = useNotifications();
	return (
		<StoreProvider>
			<Drawer>
				{notifications.map((notification: INotification) => (
					<Notification key={notification.id}>
						{/* <img
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
						</button> */}
					</Notification>
				))}
				{/* <button onClick={addNotifications}>Add another</button> */}
			</Drawer>
		</StoreProvider>
	);
}

export default App;
