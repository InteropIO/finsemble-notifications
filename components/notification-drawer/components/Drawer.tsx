import * as React from "react";

interface Props {
	children: React.PropsWithChildren<any>;
}

function Drawer(props: Props): React.ReactElement {
	return <div>{props.children}</div>;
}

export default Drawer;
