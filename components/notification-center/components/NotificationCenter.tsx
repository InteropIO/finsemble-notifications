import * as React from "react";

interface Props {
	children: React.PropsWithChildren<any>;
	title: string;
}

const NotificationCenter = (props: Props) => {
	return (
		<div id="notification-center">
			<main>{props.children}</main>
		</div>
	);
};

export default NotificationCenter;
