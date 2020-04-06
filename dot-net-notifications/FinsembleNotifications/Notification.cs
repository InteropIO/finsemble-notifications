 using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace ChartIQ.Finsemble.Notifications
{
    public class Notification
    {
		public String id { get; set; }
		public DateTime issuedAt { get; set; }
		public String receivedAt { get; private set; }
		public String type { get; set; }
		public String source { get; set; }
		public String title { get; set; }
		public String details { get; set; }
		public String headerText { get; set; }
		public String headerLogo { get; set; }
		public String contentLogo { get; set; }
		public IList<Action> actions { get; private set; }
		public int timeout { get; set; }
		public IDictionary<String, Object> meta { get; private set; }
		public Boolean isActionPerformed { get; private set; }
		public Boolean isSnoozed { get; private set; }
		public IList<PerformedAction> actionsHistory { get; private set; }
		public IList<Notification> stateHistory { get; private set; }

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
			return JObject.FromObject(this);
		}

		public override String ToString()
		{
			return ToJObject().ToString();
		} 
	}

}
