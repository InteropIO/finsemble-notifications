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
    allNotifications,
    groupNotificationsByType
  } = useNotifications();

  const toggleHover = () => {
    setHover(!hover);
  };
  let hoverStyle;
  if (this.state.hover) {
    hoverStyle = { display: "none", cursor: "pointer" };
  } else {
    hoverStyle = { display: "block" };
  }
  return (
    <div>
      {Object.entries(groupNotificationsByType(allNotifications)).map(
        ([key, values]) => {
          <span>
            <span
              style={hoverStyle}
              onMouseEnter={toggleHover}
              onMouseLeave={toggleHover}
            >
              {key}
            </span>
            {values.length}
          </span>;
        }
      )}
    </div>
  );
}

export default App;
