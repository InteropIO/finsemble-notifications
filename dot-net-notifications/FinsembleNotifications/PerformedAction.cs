using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChartIQ.Finsemble.Notifications
{
	public class PerformedAction
	{
		public String id { get; set; }
		public String type { get; set; }
		public DateTime datePerformed { get; set; }
	
		public static PerformedAction FromJObject(JObject obj)
		{
			//convert JOBject to PerformedAction:
			return obj.ToObject<PerformedAction>();
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
