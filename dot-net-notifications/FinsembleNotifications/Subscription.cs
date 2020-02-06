using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChartIQ.Finsemble.Notifications
{
	public class Subscription
	{
		public String id { get; set; }
		public Filter filter { get; set; }
		public String channel { get; set; }

		public static Subscription fromJObject(JObject obj)
		{
			//convert JOBject to Subscription:
			return obj.ToObject<Subscription>();
		}

		public JObject toJObject()
		{
			//check this works with the objects embedded under the notification
			return JObject.FromObject(this);
		}
	}
}
