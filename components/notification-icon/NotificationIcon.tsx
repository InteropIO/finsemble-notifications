import * as React from "react";
import useNotifications from "../hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";
import "./notification-icon.css";

const { useState } = React;

interface NotificationTypeList {
  type: string;
  notifications: INotification[];
}

function App(): React.ReactElement {
  const [hover, setHover] = useState(false);
  const {
    notifications,
    getAllNotifications,
    groupNotificationsByType
  } = useNotifications();

  const toggleHover = () => {
    setHover(!hover);
  };
  let hoverStyle;
  if (hover) {
    hoverStyle = { display: "none", cursor: "pointer" };
  } else {
    hoverStyle = { display: "block" };
  }

  Object.entries(groupNotificationsByType(getAllNotifications())).map(
    ([key, values]) => {
      console.log(key, values[0].id);
    }
  );

  return (
    <div id="notification-icon__wrapper">
      {Object.entries(groupNotificationsByType(getAllNotifications())).map(
        ([key, values]) => {
          const colors = {
            a: "red",
            b: "blue",
            c: "green"
          };
          return (
            <div
              className="notification-number"
              style={{ backgroundColor: colors[key] }}
              key={key}
            >
              {/* <span
                  style={hoverStyle}
                  onMouseEnter={toggleHover}
                  onMouseLeave={toggleHover}
                >
                  {key}
                </div> */}
              {values.length}
            </div>
          );
        }
      )}
    </div>
  );
}

export default App;
