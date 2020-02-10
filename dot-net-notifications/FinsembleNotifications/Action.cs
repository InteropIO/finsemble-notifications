using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChartIQ.Finsemble.Notifications
{
	

	public class Action
	{
		public String id { get; set; }
		public String buttonText { get; set; }
		public String type { get; set; }
		public int milliseconds { get; set; }
		public String component { get; set; }
		public JObject spawnParams { get; set; }
		public String channel { get; set; }
		public JObject payload { get; set; }

		public static Action fromJObject(JObject obj)
		{
			//convert JOBject to Action:
			return obj.ToObject<Action>();
		}

		public JObject toJObject()
		{
			return JObject.FromObject(this);
		}

	}

	
}
