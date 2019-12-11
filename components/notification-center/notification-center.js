import "react-devtools";
import ReactDom from "react-dom";
import App from "./App";

const FSBLReady = () => {
  try {
    // Do things with FSBL in here.
    ReactDom.render(<App />, document.getElementById("notifications-center"));
  } catch (e) {
    FSBL.Clients.Logger.error(e);
  }
};

if (window.FSBL && FSBL.addEventListener) {
  FSBL.addEventListener("onReady", FSBLReady);
} else {
  window.addEventListener("FSBLReady", FSBLReady);
}
