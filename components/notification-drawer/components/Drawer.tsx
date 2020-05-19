import * as React from "react";

interface Props {
	children: React.PropsWithChildren<any>;
}

const { useState } = React;
const { FSBL } = window;

function Drawer(props: Props): React.ReactElement {
	// TODO: All this code executes every time the component needs to render causing a lot of useless listeners to get added that never get removed. This is problematic.
	console.log("did I get here");
	const [animationClass, setAnimationClass] = useState("slide-in-right");

	React.useEffect(() => {
		const showListener = () => {
			setAnimationClass("");
			setAnimationClass("slide-in-right");
			finsembleWindow.focus();
		};

		const hideListener = () => {
			console.log("hidden slide out");
			setAnimationClass("slide-out-right");
		};

		finsembleWindow.addEventListener("shown", showListener);

		FSBL.Clients.RouterClient.addListener("finsemble.hideNotificationsDrawer", hideListener);

		return () => {
			finsembleWindow.removeEventListener("shown", showListener);
			FSBL.Clients.RouterClient.addListener("finsemble.hideNotificationsDrawer", hideListener);
		};
	});

	const animationComplete = () => {
		console.log("click slide out");
		animationClass === "slide-out-right" &&
			// TODO: remove this and change for hide
			finsembleWindow.hide();
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
