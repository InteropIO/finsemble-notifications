import * as React from "react";
import useNotifications from "../../shared/hooks/useNotifications";
import INotification from "../../../types/Notification-definitions/INotification";

const { useEffect, useState, useContext, useRef } = React;

interface Props {
  children: React.PropsWithChildren<any>;
  notifications?: INotification[];
}

function Drawer(props: Props): React.ReactElement {
  // const { setWindowId, setWindowPosition } = useFinsemble();
  const { setNotificationDrawerPosition } = useNotifications();
  const inputEl = useRef(null);
  const { notifications } = props;

  useEffect(() => {
    console.log("#run");
    inputEl.current.getBoundingClientRect().height;
    setNotificationDrawerPosition(inputEl, {
      bottom: 0,
      left: 100,
      monitor: "primary"
    });
  }, [notifications, setNotificationDrawerPosition]);

  return (
    <div id="toasts-drawer" ref={inputEl}>
      {props.children}
    </div>
  );
}

export default Drawer;
