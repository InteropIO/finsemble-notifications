import * as React from "react";
import Notification from "./Notification";
import { StoreContext } from "../store/Store";
import useFinsemble from "../../hooks/useFinsemble";
import INotification from "../../../types/Notification-definitions/INotification";
import useNotifications from "../../hooks/useNotifications";
import { getDate } from "date-fns";

const { useEffect, useState, useContext, useRef } = React;

interface Props {
  children?: React.PropsWithChildren<any>;
  notifications: Array<INotification>;
}

const Center = (props: Props) => (
  <div id="notification-center">
    <header id="notification-center__header">
      <h1>Notification Center</h1>
      <div id="notification-center__search">
        <svg
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          role="presentation"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
        </svg>
        <input />
      </div>
    </header>
    <main>
      <section id="notification-center__notifications">
        <div className="notification-center__notifications__rows">
          <div>ID</div>
          <div>Title</div>
          <div>Details</div>
          <div>Created</div>
          <div>Type</div>
        </div>

        {props.notifications.map((notification: INotification) => (
          <div
            className="notification-center__notifications__rows"
            key={notification.id}
          >
            <div>{notification.id}</div>
            <div>{notification.headerText} </div>
            <div>{notification.details} </div>
            <div>{notification.issuedAt || getDate(new Date())} </div>
            <div>{notification.type || "any"} </div>
          </div>
        ))}
      </section>
      <section id="notification-center__notification-detail">
        <div />
        <div />
        <div />
      </section>
    </main>
  </div>
);

export default Center;
