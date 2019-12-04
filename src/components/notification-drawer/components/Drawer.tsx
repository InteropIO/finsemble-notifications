import * as React from "react";
import Notification from "./Notification";
import { StoreContext } from "../store/Store";
import useFinsemble from "../../hooks/useFinsemble";

const { useEffect, useState, useContext, useRef } = React;

interface Props {
	children: React.PropsWithChildren<any>;
}

function Drawer(props: Props): React.ReactElement {
	//	const { state } = useContext(StoreContext);
	// const { setWindowId, setWindowPosition } = useFinsemble();
	// // console.log(getGlobalStore());

	// useEffect(() => {
	// 	console.log("test");
	// 	// setWindowId();
	// }, [state.windowId]);

	// const inputEl = useRef(null);

	// const addNotifications = async () => {
	// 	if (state.windowId) {
	// 		await setWindowPosition(state.windowId, {
	// 			bottom: 0,
	// 			right: 0,
	// 			height: inputEl.current.getBoundingClientRect().height,
	// 			position: "available",
	// 			monitor: "primary"
	// 		});
	// 	}
	// };

	return <div>{props.children}</div>;
	// return <div ref={inputEl}>{props.children}</div>;
}

export default Drawer;
