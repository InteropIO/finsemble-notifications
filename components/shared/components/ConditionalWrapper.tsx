import * as React from "react";

interface Props {
	condition: boolean;
	wrapper: (children: React.PropsWithChildren<any>) => void;
	children?: React.PropsWithChildren<any>;
}

export default function ConditionalWrapper(props: Props) {
	const { condition, wrapper, children } = props;

	return <>{condition ? wrapper(children) : children}</>;
}
