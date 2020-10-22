const notifications: any = {};

(window as any).FSBLNotifications = notifications;

const FSBLReady = () => {
	try {
		// SHOULD NOW BE ABLE TO RUN
		// const notification = new FSBL.Clients.NotificationClient.Notification();
		// const action = new FSBL.Clients.NotificationClient.Action();
		// const sub = new FSBL.Clients.NotificationClient.Subscription();
		// const filter = new FSBL.Clients.NotificationClient.Filter();
		// FSBL.Clients.NotificationClient.notify([notification]);
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
};

if (window.FSBL && (FSBL as any).addEventListener) {
	(FSBL as any).addEventListener("onReady", FSBLReady);
} else {
	window.addEventListener("FSBLReady", FSBLReady);
}
