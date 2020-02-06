using Newtonsoft.Json.Linq;
using System;
using System.Windows;
using System.Collections.Generic;

namespace ChartIQ.Finsemble.Notifications
{
	public class NotificationClient
	{
		/**
		 * Internal (private) router channels, should not need to be referenced by outside of the Client src
		 */
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


		internal NotificationClient(Finsemble bridge)
		{
			this.bridge = bridge;
			routerClient = bridge.RouterClient;
		}


		/**
		 * Subscribe to a notification stream given a set of name/value pair filters. Returns subscriptionId
		 * @param subscription with name value pair used to match on.
		 * @param onSubscription called when subscription is successfully created or an error is thrown.
		 * @param onNotification called when a notification has been received.
		 */
		public void subscribe(Subscription subscription, EventHandler<FinsembleEventArgs> onSubscription, EventHandler<Notification> onNotification)
		{
			bridge.RPC("Logger.log", new List<JToken> { "Attempting to subscribe: " + subscription.toJObject().ToString() });
			routerClient.Query(ROUTER_ENDPOINT_SUBSCRIBE, 
			//new JObject
			//	{
			//		["field"] = parameters["field"],
			//		["value"] = parameters["value"]
			//	}, 
			subscription.toJObject(),
			(s, args) => {
				if (args.response["data"] != null)
				{
					//retrieve the subscription id
					JToken subIdToken = args.response["data"];
					String subId = subIdToken.ToString();
					bridge.RPC("Logger.log", new List<JToken> { "Got subscription id: " + subId });

					//setup a query responder for for the subscription id
					routerClient.AddResponder(subId,
						(s2, args2) => {
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

		/**
		 * Used to unsubscribe to a notification stream.
		 * @param subscriptionId which was returned when subscription was created.
		 */
		public void unsubscribe(String subscriptionId, EventHandler<FinsembleEventArgs> responseHandler)
		{
			routerClient.Query(ROUTER_ENDPOINT_UNSUBSCRIBE, new JValue(subscriptionId), responseHandler);
			routerClient.RemoveResponder(subscriptionId, true);
		}

		/**
		 * Return an ISO8601 formatted date a notification matching the specified source was issued.
		 *
		 * @param  source identify which notification to save lastUpdated time for.
		 * @param responseHandler last issued at date string in the ISO8601 date format converted to DateTime.
		 */
		public void getLastIssuedAt(String source, EventHandler<FinsembleEventArgs> responseHandler)
		{
			routerClient.Query(ROUTER_ENDPOINT_LAST_ISSUED, new JValue(source), responseHandler);
			//TODO convert to DateTime
		}

		/**
		 * Used by UI components that need to display a list of historical notifications.
		 * @param  since ISO8601 formatted string to fetch notifications from.
		 * @param  filter to match to notifications.
		 * @responseHandler array of notifications (Notification[]).
		 */
		public void fetchHistory(DateTime since, Filter filter, EventHandler<FinsembleEventArgs> responseHandler)
		{
			routerClient.Query(ROUTER_ENDPOINT_LAST_ISSUED, new JObject
			{
				["since"] = since.ToString("s", System.Globalization.CultureInfo.InvariantCulture)
				["filter"] = filter.toJObject()
			}, responseHandler);
			//TODO convert to array of notifications
		}

		/**
		 * Creates or updates notifications in Finsemble.
		 * @param notifications Array of INotification
		 * @param responseHandler
		 */
		public void notify(Notification[] notifications, EventHandler<FinsembleEventArgs> responseHandler)
		{
			JArray notificationObjects = new JArray();
			for (int i = 0; i < notifications.Length; i++)
			{
				notificationObjects.Add(notifications[i].toJObject());
			}
			routerClient.Query(ROUTER_ENDPOINT_NOTIFY, notificationObjects, responseHandler);
		}

		/**
		 * Update the notification to mark actions performed.
		 * @param notifications Notifications to apply action to.
		 * @param action which has been triggered by user.
		 * @param responseHandler
		 */
		public void markActionHandled(Notification[] notifications, Action action, EventHandler<FinsembleEventArgs> responseHandler)
		{
			JArray notificationObjects = new JArray();
			for (int i = 0; i < notifications.Length; i++)
			{
				notificationObjects.Add(notifications[i].toJObject());
			}
			
			routerClient.Query(ROUTER_ENDPOINT_HANDLE_ACTION, new JObject
			{
				["notifications"] = notificationObjects
				["action"] = action.toJObject()
			}, responseHandler);
		}


	}
}
