import * as React from "react";

interface Props {
	children: React.PropsWithChildren<any>;
}

const { useState } = React;
const { FSBL } = window;

function Drawer(props: Props): React.ReactElement {
	const [animationClass, setAnimationClass] = useState("slide-in-right");

	window.onfocus = () => {
		setAnimationClass("");
		setAnimationClass("slide-in-right");
	};
	const animationComplete = () => {
		animationClass === "slide-out-right" &&
			// TODO: remove this and change for hide
			FSBL.Clients.WindowClient.minimize();
	};
	return (
		<div id="drawer" className={animationClass} onAnimationEnd={animationComplete}>
			<div id="notifications-drawer__menu">
				<img
					src="../shared/assets/dashboard.svg"
					id="notification-center-icon"
					// TODO: Move this out
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
