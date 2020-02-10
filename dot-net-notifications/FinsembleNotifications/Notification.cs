using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
		public Action[] actions;
		public int timeout;
		public Dictionary<String, Object> meta;
		public Boolean isActionPerformed;
		public Boolean isSnoozed;
		public PerformedAction[] actionsHistory;
		public Notification[] stateHistory;

		public Notification()
		{
			this.actions = null;
			this.isActionPerformed = false;
			this.isSnoozed = false;
			this.actionsHistory = null;
			this.meta = new Dictionary<string, object>();
			this.stateHistory = null;
		}

		public static Notification fromJObject(JObject obj)
		{
			//convert JOBject to Notification:
			return obj.ToObject<Notification>();
		}

		public  JObject toJObject()
		{
			//check this works with the objects embedded under the notification
			return JObject.FromObject(this);
		}

			//JObject o = JObject.FromObject(new
			//{
			//	channel = new
			//	{
			//		title = "James Newton-King",
			//		link = "http://james.newtonking.com",
			//		description = "James Newton-King's blog.",
			//		item =
			//	from p in posts
			//	orderby p.Title
			//	select new
			//	{
			//		title = p.Title,
			//		description = p.Description,
			//		link = p.Link,
			//		category = p.Categories
			//	}
			//	}
			//});
	}

}
