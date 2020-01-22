import * as React from "react";
const { useState, useEffect } = React;

interface Props {
	children?: React.PropsWithChildren<any>;
	displayDuration?: number;
	animateIn?: string;
	animateOut?: string;
	animateOutComplete: Function;
}

export default function Animate(props: Props) {
	const { animateIn, animateOut, displayDuration, animateOutComplete } = props;
	const [css, setCSS] = useState(animateIn);
	const [display, setDisplay] = useState({});

	useEffect(
		() => {
			let timer1;
			if (props.displayDuration) {
				timer1 = setTimeout(() => {
					setCSS(animateOut);
				}, displayDuration);
			}

			// this will clear Timeout when component unmont like in willComponentUnmount
			return () => {
				timer1 && clearTimeout(timer1);
				if (animateOut) {
					setCSS(animateOut);
					animateOutComplete();
				}
			};
		},
		[] // eslint-disable-line
		//useEffect will run only one time
		//if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
	);

	const hideNotification = () => {
		css === animateOut && setDisplay({ display: "none" });
	};

	return (
		<div className={css} onAnimationEnd={hideNotification} style={display}>
			{props.children}
		</div>
	);
}
