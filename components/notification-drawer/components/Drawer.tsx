import * as React from "react";

interface Props {
	children: React.PropsWithChildren<any>;
}

const { useState } = React;
const { FSBL } = window;

function Drawer(props: Props): React.ReactElement {
	const [animationClass, setAnimationClass] = useState("slide-in-right");

	// TODO: use finsemble events instead to work out if the window is shown or hidden - finsembleWindow.windowState
	// window.onblur = () => {
	// 	setAnimationClass("slide-out-right");
	// 	console.log("* window blurred");
	// };

	window.onfocus = () => {
		setAnimationClass("");
		setAnimationClass("slide-in-right");
		console.log("* window has focus");
	};
	const animationComplete = () => {
		animationClass === "slide-out-right" &&
			// TODO: remove this and change for hide
			FSBL.Clients.WindowClient.minimize(console.log);
	};
	return (
		<div id="drawer" className={animationClass} onAnimationEnd={animationComplete}>
			<div id="notifications-drawer__menu">
				<img
					src="../shared/assets/dashboard.svg"
					id="notification-center-icon"
					onClick={() =>
						FSBL.Clients.LauncherClient.showWindow(
							{
								windowName: null,
								componentType: "notification-center"
							},
							{}
						)
					}
				/>
				<img
					src="../shared/assets/double_arrow.svg"
					id="hide-icon"
					onClick={() => setAnimationClass("slide-out-right")}
				/>
			</div>
			{props.children}
		</div>
	);
}

export default Drawer;
