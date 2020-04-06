using Newtonsoft.Json.Linq;
using System;

namespace ChartIQ.Finsemble.Notifications
{
	public class Subscription
	{
		public String id { get; set; }
		public Filter filter { get; set; }
		public String channel { get; set; }

		public Subscription()
		{
			this.filter = null;
		}

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
			return JObject.FromObject(this);
		}

		public override String ToString()
		{
			return ToJObject().ToString();
		}
	}
}
