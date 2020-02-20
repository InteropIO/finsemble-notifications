using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace ChartIQ.Finsemble.Notifications
{
    public class Notification
    {
		public String id;
		public DateTime issuedAt;
		public String receivedAt;
		public String type;
		public String source;
		public String title;
		public String details;
		public String headerText;
		public String headerLogo;
		public String contentLogo;
		public List<Action> actions;
		public int timeout;
		public Dictionary<String, Object> meta;
		public Boolean isActionPerformed;
		public Boolean isSnoozed;
		public List<PerformedAction> actionsHistory;
		public List<Notification> stateHistory;

		public Notification()
		{
			this.actions = new List<Action>();
			this.isActionPerformed = false;
			this.isSnoozed = false;
			this.actionsHistory = null;
			this.meta = new Dictionary<string, object>();
			this.actionsHistory = new List<PerformedAction>();
			this.stateHistory = new List<Notification>();
		}

		public static Notification FromJObject(JObject obj)
		{
			//convert JOBject to Notification:
			return obj.ToObject<Notification>();
		}

		public JObject ToJObject()
		{
			//check this works with the objects embedded under the notification
			return JObject.FromObject(this);
		}

		public override String ToString()
		{
			return ToJObject().ToString();
		} 
	}

}
