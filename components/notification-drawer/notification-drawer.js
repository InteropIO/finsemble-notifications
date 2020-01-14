import "react-devtools";
import React from "react";
import ReactDom from "react-dom";
import App from "./App";

const FSBLReady = () => {
	try {
		// Do things with FSBL in here.
		ReactDom.render(<App />, document.getElementById("notifications-drawer"));
		window.onblur = () =>
			FSBL.Clients.WindowClient.minimize(console.log("blrd"));
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
};

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady);
} else {
	window.addEventListener("FSBLReady", FSBLReady);
}
