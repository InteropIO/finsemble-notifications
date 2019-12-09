import * as React from "react";
import useNotifications from "../hooks/useNotifications";

const { useState } = React;

function App(): React.ReactElement {
  const { notifications } = useNotifications();
  return <div>{notifications.map(notification => {})}</div>;
}

export default App;
