import * as React from "react";
import Notification from "./Notification";
import { StoreContext } from "../store/Store";
import useNotifications from "../../hooks/useNotifications";

const { useEffect, useState, useContext, useRef } = React;

interface Props {
  children: React.PropsWithChildren<any>;
}

function Drawer(props: Props): React.ReactElement {
  // const { setWindowId, setWindowPosition } = useFinsemble();
  const { setWindowId, setWindowPosition } = useNotifications();

  useEffect(() => {
    setWindowId();
  }, [state.windowId]);

  const inputEl = useRef(null);

  return <div ref={inputEl}>{props.children}</div>;
}

export default Drawer;
