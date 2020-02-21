using Newtonsoft.Json.Linq;
using System;
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
		internal static String ROUTER_NAMESPACE = "notification.";
		internal static String ROUTER_ENDPOINT_NOTIFY = ROUTER_NAMESPACE + "notify";
		internal static String ROUTER_ENDPOINT_SUBSCRIBE = ROUTER_NAMESPACE + "subscribe";
		internal static String ROUTER_ENDPOINT_UNSUBSCRIBE = ROUTER_NAMESPACE + "unsubscribe";
		internal static String ROUTER_ENDPOINT_HANDLE_ACTION = ROUTER_NAMESPACE + "handle_action";
		internal static String ROUTER_ENDPOINT_LAST_ISSUED = ROUTER_NAMESPACE + "last_issued";
		internal static String ROUTER_ENDPOINT_FETCH_HISTORY = ROUTER_NAMESPACE + "fetch_history";
		internal static String ROUTER_ENDPOINT_CHANNEL_PREFIX = ROUTER_NAMESPACE + "notification";
		internal static String ROUTER_ENDPOINT_ACTION_PREFIX = ROUTER_NAMESPACE + "action.";

		private Finsemble bridge;
		private RouterClient routerClient;

		private List<Subscription> subscriptions;

		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="bridge">Finsemble API bridge, used to access teh Finsemble Router and Logger clients</param>
		public NotificationClient(Finsemble bridge)
		{
			this.bridge = bridge;
			routerClient = bridge.RouterClient;
			subscriptions = new List<Subscription>();
		}

		/// <summary>
		/// Subscribe to a notification stream given a set of name/value pair filters. Returns subscriptionId
		/// </summary>
		/// <param name="subscription">Subscription object defining with name value pair used to match on.</param>
		/// <param name="onSubscription">Callback used when subscription is successfully created or an error is thrown - passed the populated subscription object as a JObject.</param>
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
					JObject responseObject = args.response?["data"] as JObject;
					
					if (responseObject != null && responseObject["data"] != null)
					{
						JObject subDetails = responseObject["data"] as JObject;
						subscription.id = subDetails["id"].ToString();
						subscription.channel = subDetails["channel"].ToString();
						bridge.RPC("Logger.log", new List<JToken> { "Got subscription details: " + subscription.ToString() });
						subscriptions.Add(subscription);
						setupSubscriptionResponder(subscription.channel, onNotification);
						onSubscription(s, new FinsembleEventArgs(args.error, subscription.ToJObject()));
					}
					else
					{
						//subscription failed due to empty response
						bridge.RPC("Logger.error", new List<JToken> { "Notification subscription failed for subscription " + subscription.ToString() + " as the response did not contain the expected data" });
						JObject error = new JObject();
						error.Add("reason", "Notification subscription failed for subscription " + subscription.ToString() + " as the response did not contain the expected data");
						onSubscription(s, new FinsembleEventArgs(error, null));
					}
				}
				else
				{
					//subscription failed with error from service
					bridge.RPC("Logger.error", new List<JToken> { "Notification subscription failed for subscription " + subscription.ToString() + ", error: " + args.error.ToString() });
					onSubscription(s, new FinsembleEventArgs(args.error, new JObject()));
				}
			});
		}

		/// <summary>
		/// setup a query responder for a specified the subscription id
		/// </summary>
		/// <param name="subChannel">The subscription channel to respond to.</param>
		/// <param name="onNotification">Callback function to be used to receive a notification.</param>
		private void setupSubscriptionResponder(string subChannel, EventHandler<Notification> onNotification)
		{
			String channel = ROUTER_NAMESPACE + subChannel;
			bridge.RPC("Logger.log", new List<JToken> { "Adding responder for subscription channel: " + channel });
			routerClient.AddResponder(channel,
				(s2, args2) =>
				{
					bridge.RPC("Logger.log", new List<JToken> { "Received notification message on subscription channel: " + channel + ", notification JSON: " + args2.ToString() });
					if (args2.response["data"] != null)
					{
						Notification aNotif = args2.response["data"].ToObject<Notification>();
						onNotification(s2, aNotif);
					}
					else
					{
						bridge.RPC("Logger.error", new List<JToken> { "Didn't find notification for subscription channel " + channel + " in message: " + args2.ToString() });
					}
				});
		}

		/// <summary>
		/// Used to unsubscribe to a notification stream.
		/// </summary>
		/// <param name="subscriptionId">The subscription id of the stream to unsubscribe from.</param>
		/// <param name="responseHandler">Callback used when complete.</param>
		public void unsubscribe(String subscriptionId, EventHandler<FinsembleEventArgs> responseHandler)
		{
			//find the subscription
			Subscription sub = null;
			for (int i = 0; i < subscriptions.Count; i++)
			{
				if (subscriptions[i].id == subscriptionId)
				{
					sub = subscriptions[i];
					break;
				}
			}
			if (sub != null)
			{
				routerClient.Query(ROUTER_ENDPOINT_UNSUBSCRIBE, new JValue(sub.id), responseHandler);
				routerClient.RemoveResponder(ROUTER_NAMESPACE + sub.channel, true);
				subscriptions.Remove(sub);
			}
			else
			{
				bridge.RPC("Logger.error", new List<JToken> { "Can't unsubscribe from subscription id " + subscriptionId + " as it was not found!"});
			}
			
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
