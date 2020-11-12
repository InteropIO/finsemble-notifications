import * as React from "react";

export default function SVGBase({
	style = {},
	fill = "none",
	width = "24",
	height = "24",
	className = "",
	children,
	viewBox = "0 0 24 24",
	d = "",
	opacity = "",
	fillRule,
	clipRule = "",
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	onClick = () => {},
	onMouseDown,
	onMouseUp
}: SVGProps) {
	return (
		<svg
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onClick={onClick}
			width={width}
			style={style}
			height={height}
			viewBox={viewBox}
			fill={fill}
			className={`svg-icon ${className || ""}`}
			xmlns="http://www.w3.org/2000/svg"
		>
			{d.length ? <path opacity={opacity} fillRule={fillRule} clipRule={clipRule} d={d} fill={fill} /> : children}
		</svg>
	);
}

export type SVGProps = React.SVGAttributes<SVGElement>;
