import * as React from "react";
import { formatDistanceToNow } from "date-fns";
interface Props {
	children: React.PropsWithChildren<any>;
}

const Notification = (props: Props) => (
	// <div className="notification">{props.children}</div>
	<div className="notification">
		<div className="detail-area">
			<div>
				<img src="https://lsloz.csb.app/notifications.svg" />
			</div>
			<div>RFQ Market Update</div>
			<div>
				{formatDistanceToNow(new Date(2019, 10, 21, 22, 0, 19), {
					includeSeconds: true
				})}{" "}
				ago
			</div>
			<div>^</div>
		</div>
		<div className="content-area">
			<div>
				{/* <img src="https://via.placeholder.com/20x20.png?text=logo" /> */}
				<img src="https://si.wsj.net/public/resources/images/IF-AC796_JUNKST_GR_20161103121700.jpg" />
			</div>
			<div>Request for trade TESL bid $11.25 5000 shares.</div>
		</div>
		<hr />
		<div className="action-area">
			<button>Dismiss</button>
			<button>Reply</button>
			<button>Actions</button>
		</div>
	</div>
);

export default Notification;
