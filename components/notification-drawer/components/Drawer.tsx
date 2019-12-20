import * as React from "react";
import useNotifications from "../../hooks/useNotifications";

const { useEffect, useState, useContext, useRef } = React;

interface Props {
  children: React.PropsWithChildren<any>;
}

function Drawer(props: Props): React.ReactElement {
  // const { setWindowId, setWindowPosition } = useFinsemble();
  const { setNotificationDrawerPosition } = useNotifications();
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.getBoundingClientRect().height;
    setNotificationDrawerPosition(inputEl, {
      bottom: 0,
      left: 100,
      monitor: "primary"
    });
  });

  return <div ref={inputEl}>{props.children}</div>;
}

export default Drawer;
