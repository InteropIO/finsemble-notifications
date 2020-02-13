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

		public Subscription(Filter filter)
		{
			this.filter = filter;
		}

		public static Subscription FromJObject(JObject obj)
		{
			//convert JOBject to Subscription:
			return obj.ToObject<Subscription>();
		}

		public JObject ToJObject()
		{
			//check this works with the objects embedded under the notification
			return JObject.FromObject(this);
		}
	}
}
