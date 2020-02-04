import * as React from "react";

interface Props {
	children: React.PropsWithChildren<any>;
}

const { useState } = React;

function Drawer(props: Props): React.ReactElement {
	const [animationClass, setAnimationClass] = useState("slide-in-right");

	window.onblur = () => {
		setAnimationClass("slide-out-right");
		console.log("* window blurred");
	};

	window.onfocus = () => {
		setAnimationClass("slide-in-right");
		console.log("* window has focus");
	};

	const animationComplete = () => {
		animationClass === "slide-out-right" &&
			FSBL.Clients.WindowClient.minimize();
	};
	return (
		<div
			id="drawer"
			className={animationClass}
			onAnimationEnd={animationComplete}
		>
			<div id="notifications-drawer__menu">
				<img
					src="../shared/assets/dashboard.svg"
					id="notification-center-icon"
					onClick={() =>
						FSBL.Clients.LauncherClient.showWindow({
							componentType: "notification-center"
						})
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
