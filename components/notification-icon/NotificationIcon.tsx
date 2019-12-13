import * as React from "react";
import useNotifications from "../hooks/useNotifications";
import INotification from "../../types/Notification-definitions/INotification";

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
    <div>
      <span>
        {Object.entries(groupNotificationsByType(getAllNotifications())).map(
          ([key, values]) => {
            return (
              <span key={key}>
                {/* <span
                  style={hoverStyle}
                  onMouseEnter={toggleHover}
                  onMouseLeave={toggleHover}
                >
                  {key}
                </span> */}
                {values.length}
              </span>
            );
          }
        )}
      </span>
    </div>
  );
}

export default App;
