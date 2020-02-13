using Newtonsoft.Json.Linq;
using System;
using System.Windows;
using System.Collections.Generic;

namespace ChartIQ.Finsemble.Notifications
{
	/// <summary>
	/// NotificationClient
	/// Used to send, receive and manipulate notifications
	/// </summary>
	public class NotificationClient
	{
		/// Internal (private) router channels, should not need to be referenced by outside of the Client src
		internal String ROUTER_ENDPOINT_NOTIFY = "notification.notify";
		internal String ROUTER_ENDPOINT_SUBSCRIBE = "notification.subscribe";
		internal String ROUTER_ENDPOINT_UNSUBSCRIBE = "notification.unsubscribe";
		internal String ROUTER_ENDPOINT_HANDLE_ACTION = "notification.handle_action";
		internal String ROUTER_ENDPOINT_LAST_ISSUED = "notification.last_issued";
		internal String ROUTER_ENDPOINT_FETCH_HISTORY = "notification.fetch_history";
		internal String ROUTER_ENDPOINT_CHANNEL_PREFIX = "notification.notification";
		internal String ROUTER_ENDPOINT_ACTION_PREFIX = "notification.action.";

		private Finsemble bridge;
		private RouterClient routerClient;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="bridge">Finsemble API bridge, used to access teh Finsemble Router and Logger clients</param>
		public NotificationClient(Finsemble bridge)
		{
			this.bridge = bridge;
			routerClient = bridge.RouterClient;
		}

		/// <summary>
		/// Subscribe to a notification stream given a set of name/value pair filters. Returns subscriptionId
		/// </summary>
		/// <param name="subscription">Subscription object defining with name value pair used to match on.</param>
		/// <param name="onSubscription">Callback used when subscription is successfully created or an error is thrown.</param>
		/// <param name="onNotification">Callback used  when a notification has been received.</param>
		public void subscribe(Subscription subscription, EventHandler<FinsembleEventArgs> onSubscription, EventHandler<Notification> onNotification)
		{
			bridge.RPC("Logger.log", new List<JToken> { "Attempting to subscribe: " + subscription.ToJObject().ToString() });
			routerClient.Query(ROUTER_ENDPOINT_SUBSCRIBE, 
			subscription.ToJObject(),
			(s, args) => {
				if (args.response["data"] != null)
				{
					//retrieve the subscription id
					JToken subIdToken = args.response["data"];
					String subId = subIdToken.ToString();
					bridge.RPC("Logger.log", new List<JToken> { "Got subscription id: " + subId });
					setupSubscriptionResponder(subId, onNotification);

					onSubscription(s, new FinsembleEventArgs(args.error, subIdToken));
				}
				else
				{
					//subscription failed
					bridge.RPC("Logger.error", new List<JToken> { "Notification subscription failed for subscription " + subscription.ToString() + ", error: " + args.error.ToString() });
					onSubscription(s, new FinsembleEventArgs(args.error, new JObject()));
				}
			});
		}

		/// <summary>
		/// setup a query responder for a specified the subscription id
		/// </summary>
		/// <param name="subId">The subscription ID to respond to.</param>
		/// <param name="onNotification">Callback function to be used to receive a notification.</param>
		private void setupSubscriptionResponder(string subId, EventHandler<Notification> onNotification)
		{
		
			routerClient.AddResponder(subId,
				(s2, args2) =>
				{
					bridge.RPC("Logger.log", new List<JToken> { "Received notification message for subscription d: " + subId + ", notification JSON: " + args2.ToString() });
					if (args2.response["data"] != null)
					{
						Notification aNotif = args2.response["data"].ToObject<Notification>();
						onNotification(s2, aNotif);
					}
					else
					{
						bridge.RPC("Logger.error", new List<JToken> { "Didn't find notification for subId " + subId + " in message: " + args2.ToString() });
					}
				});
		}

		/// <summary>
		/// Used to unsubscribe to a notification stream.
		/// </summary>
		/// <param name="subscriptionId">The subscription id of the stream to unsubscribe fromd.</param>
		/// <param name="responseHandler">Callback used when complete.</param>
		public void unsubscribe(String subscriptionId, EventHandler<FinsembleEventArgs> responseHandler)
		{
			routerClient.Query(ROUTER_ENDPOINT_UNSUBSCRIBE, new JValue(subscriptionId), responseHandler);
			routerClient.RemoveResponder(subscriptionId, true);
		}

		/// <summary>
		/// Returns DateTime object (representing an ISO8601 formatted date from the notification service) at
		/// which a notification matching the specified source was last issued.
		/// </summary>
		/// <param name="source">Identifies which notification to save lastUpdated time for.</param>
		/// <param name="responseHandler"The ISO8601 date Object returned by the notification service, returned as a DateTime Object.</param>
		public void getLastIssuedAt(String source, EventHandler<FinsembleEventArgs> responseHandler)
		{
			routerClient.Query(ROUTER_ENDPOINT_LAST_ISSUED, new JValue(source), responseHandler);
			//TODO convert to DateTime before passing to callback
		}

		/// <summary>
		///  Used by UI components that need to display a list of historical notifications.
		/// </summary>
		/// <param name="since">ISO8601 formatted string to fetch notifications from.</param>
		/// <param name="filter">(Optional) Filter to match to notifications.</param>
		/// <param name="responseHandler">Callback that will be used to return an array of returned notifications.</param>
		public void fetchHistory(DateTime since, Filter filter, EventHandler<FinsembleEventArgs> responseHandler)
		{
			JObject args = new JObject { };
			if (since != null)
			{
				args.Add("since", since.ToString("s", System.Globalization.CultureInfo.InvariantCulture));
			}
			if (filter != null)
			{
				args.Add("filter", filter.ToJObject());
			}
			routerClient.Query(ROUTER_ENDPOINT_LAST_ISSUED, args, responseHandler);
			//TODO convert to array of notifications before passing to callback
		}

		/// <summary>
		/// Creates or updates notifications in Finsemble.
		/// </summary>
		/// <param name="notifications">Notifications to pass to the Notification service</param>
		/// <param name="responseHandler">Callback used when complete, no data is returned</param>
		public void notify(Notification[] notifications, EventHandler<FinsembleEventArgs> responseHandler)
		{
			JArray notificationObjects = new JArray();
			for (int i = 0; i < notifications.Length; i++)
			{
				notificationObjects.Add(notifications[i].ToJObject());
			}
			routerClient.Query(ROUTER_ENDPOINT_NOTIFY, notificationObjects, responseHandler);
		}

		/// <summary>
		/// Requests that the notification service perform the specified action on the array of notifications 
		/// and mark each notification as handled.
		/// </summary>
		/// <param name="notifications">An array of Notifications to apply action to.</param>
		/// <param name="action">The action to be performed on the notification(s)</param>
		/// <param name="responseHandler">Callback used when the action has been performed and will contain a success/fail message and any error messages</param>
		public void performAction(Notification[] notifications, Action action, EventHandler<FinsembleEventArgs> responseHandler)
		{
			JArray notificationObjects = new JArray();
			for (int i = 0; i < notifications.Length; i++)
			{
				notificationObjects.Add(notifications[i].ToJObject());
			}
			
			routerClient.Query(ROUTER_ENDPOINT_HANDLE_ACTION, new JObject
			{
				["notifications"] = notificationObjects
				["action"] = action.ToJObject()
			}, responseHandler);
		}


	}
}
