import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import INotification from "../../../types/Notification-definitions/INotification";
import IAction from "../../../types/Notification-definitions/IAction";

interface Props {
  children?: React.PropsWithChildren<any>;
  notification: INotification;
}

const Notification = (props: Props) => {
  const { notification } = props;
  const {
    id,
    issuedAt = new Date(),
    type,
    title,
    details,
    headerText,
    headerLogo,
    contentLogo = (
      <img src="https://si.wsj.net/public/resources/images/IF-AC796_JUNKST_GR_20161103121700.jpg" />
    ),
    actions,
    timeout,
    meta,
    dismissedAt,
    actionsHistory
  } = notification;
  return (
    <div className="notification">
      <div className="detail-area">
        <div>
          <img src="https://lsloz.csb.app/notifications.svg" />
        </div>
        <div>{headerText}</div>
        <div>
          {formatDistanceToNow(issuedAt, {
            includeSeconds: true
          })}{" "}
          ago
        </div>
        <div>^</div>
      </div>
      <div className="content-area">
        <div>
          {/* <img src="https://via.placeholder.com/20x20.png?text=logo" /> */}
          {contentLogo}
        </div>
        <div>{details}</div>
      </div>
      <hr />
      <div className="action-area">
        {actions.map((action: IAction) => (
          <button onClick={}>{action.buttonText}</button>
        ))}
      </div>
    </div>
  );
};

export default Notification;
