using System;
using System.Collections.Generic;
using System.Reflection;
using System.Windows;
using System.Windows.Media;
using ChartIQ.Finsemble;
using log4net;
using Newtonsoft.Json.Linq;
using ChartIQ.Finsemble.Notifications;

namespace NotifyComponent
{
	/// <summary>
	/// Interaction logic for MainWindow.xaml
	/// </summary>
	public partial class MainWindow : Window
	{
		/// <summary>
		/// The logger
		/// </summary>
		private static readonly ILog Logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

		private Finsemble FSBL;
		private ChartIQ.Finsemble.Notifications.NotificationClient notifier;

		/// <summary>
		/// The MainWindow is created by the App so that we can get command line arguments passed from Finsemble.
		/// </summary>
		/// <param name="args"></param>
		public MainWindow(string[] args)
		{

			// Trigger actions on close when requested by Finsemble, e.g.:
			this.Closing += MainWindow_Closing;

			FSBL = new Finsemble(args, this); // Finsemble needs the command line arguments to connect and also this Window to manage snapping, docking etc.
			FSBL.Connected += Finsemble_Connected;
			FSBL.Connect();
		}

		private void Notification_1_Click(object sender, RoutedEventArgs e)
		{
			//object selected = ComponentSelect.SelectedValue;
			//if (selected != null)
			//{
			//	string componentName = selected.ToString();
			//	FSBL.RPC("LauncherClient.spawn", new List<JToken> {
			//		componentName,
			//		new JObject { ["addToWorkspace"] = true }
			//	}, (s, a) => { });
			//}

			Notification not1 = new Notification();
			not1.issuedAt = DateTime.Now;
			not1.source = "WPF NotifyComponent";
			not1.headerText = "WPF Internal Actions (No Id)";
			not1.details = "Should create a new notification in UI every time it's sent (from WPF)";
			not1.type = "email";
			not1.headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/email.svg";
			not1.contentLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/graph.png";

			ChartIQ.Finsemble.Notifications.Action dismiss = new ChartIQ.Finsemble.Notifications.Action();
			dismiss.buttonText = "Dismiss";
			dismiss.type = ActionTypes.DISMISS;

			ChartIQ.Finsemble.Notifications.Action snooze = new ChartIQ.Finsemble.Notifications.Action();
			snooze.buttonText = "Snooze";
			snooze.type = ActionTypes.SNOOZE;
			snooze.milliseconds = 10000;

			ChartIQ.Finsemble.Notifications.Action welcome = new ChartIQ.Finsemble.Notifications.Action();
			welcome.buttonText = "Welcome";
			welcome.type = ActionTypes.SPAWN;
			welcome.component = "Welcome Component";

			not1.actions = (new[] {snooze, welcome, dismiss});

			notifier.notify((new[] { not1 }), (s, r) => {

				FSBL.RPC("Logger.log", new List<JToken> {
					"Notification sent, response: " + r.ToString()
				});

				//check response for notification id 
			});

		}

		private void Notification_2_Click(object sender, RoutedEventArgs e)
		{
			Notification not2 = new Notification();
			not2.issuedAt = DateTime.Now;
			not2.id = "wpf_notification_123";
			not2.source = "WPF NotifyComponent";
			not2.headerText = "WPF Notification Same Id";
			not2.details = "Should only be in UI once (WPF)";
			not2.type = "chat";
			not2.headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/chat.svg";
			not2.contentLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/sheild.png";

			ChartIQ.Finsemble.Notifications.Action query = new ChartIQ.Finsemble.Notifications.Action();
			query.buttonText = "Send Query";
			query.type = ActionTypes.QUERY;
			query.channel = "query-channel";
			query.payload = new JObject();
			query.payload.Add("hello", "world");

			ChartIQ.Finsemble.Notifications.Action transmit = new ChartIQ.Finsemble.Notifications.Action();
			transmit.buttonText = "Send Transmit";
			transmit.type = ActionTypes.TRANSMIT;
			transmit.channel = "transmit-channel";
			transmit.payload.Add("foo", "bar");

			ChartIQ.Finsemble.Notifications.Action publish = new ChartIQ.Finsemble.Notifications.Action();
			publish.buttonText = "Send Publish";
			publish.type = ActionTypes.PUBLISH;
			publish.channel = "publish-channel";
			publish.payload.Add("xyzzy", "moo");

			not2.actions = (new[] { query, transmit, publish });

			notifier.notify((new[] { not2 }), (s, r) => {

				FSBL.RPC("Logger.log", new List<JToken> {
					"Notification sent, response: " + r.ToString()
				});

				//check response for notification id 
			});

		}

		private void Notification_3_Click(object sender, RoutedEventArgs e)
		{
			
		}

		private void Finsemble_Connected(object sender, EventArgs e)
		{
			Application.Current.Dispatcher.Invoke(delegate //main thread
			{
				// Initialize this Window and show it
				InitializeComponent(); // Initialize after Finsemble is connected
				FinsembleHeader.SetBridge(FSBL); // The Header Control needs a connected finsemble instance

				//Styling the Finsemble Header
				FinsembleHeader.SetActiveBackground(new SolidColorBrush((Color)ColorConverter.ConvertFromString("#22262F")));
				FinsembleHeader.SetInactiveBackground(new SolidColorBrush((Color)ColorConverter.ConvertFromString("#22262F")));
				FinsembleHeader.SetButtonHoverBackground(new SolidColorBrush((Color)ColorConverter.ConvertFromString("#0A8CF4")));
				FinsembleHeader.SetInactiveButtonHoverBackground(new SolidColorBrush((Color)ColorConverter.ConvertFromString("#0A8CF4")));
				FinsembleHeader.SetCloseButtonHoverBackground(new SolidColorBrush((Color)ColorConverter.ConvertFromString("#F26666")));
				FinsembleHeader.SetInactiveCloseButtonHoverBackground(new SolidColorBrush((Color)ColorConverter.ConvertFromString("#F26666")));
				FinsembleHeader.SetDockingButtonDockedBackground(new SolidColorBrush((Color)ColorConverter.ConvertFromString("#0A8CF4")));
				FinsembleHeader.SetTitleForeground(new SolidColorBrush((Color)ColorConverter.ConvertFromString("#ACB2C0")));
                FinsembleHeader.SetButtonForeground(new SolidColorBrush((Color)ColorConverter.ConvertFromString("#ACB2C0")));

                FinsembleHeader.SetButtonFont(null, 8, FontStyles.Normal, FontWeights.Normal);
				FinsembleHeader.SetTitleFont(null, 12, FontStyles.Normal, FontWeights.SemiBold);

				//Set window title
				FinsembleHeader.SetTitle("Notify Example Component");

				notifier = new NotificationClient(FSBL);

				this.Show();
			});

			// Logging to the Finsemble Central Console
			/*FSBL.RPC("Logger.error", new List<JToken> {
				"Error Test"
			});

			FSBL.RPC("Logger.log", new List<JToken> {
				"Log Test"
			});

			FSBL.RPC("Logger.debug", new List<JToken> {
				"Debug Test"
			});

			FSBL.RPC("Logger.info", new List<JToken> {
				"Info Test"
			});

			FSBL.RPC("Logger.verbose", new List<JToken> {
				"Verbose Test"
			});
			*/

		}

		/// <summary>
		/// Example window close handler
		/// </summary>
		/// <param name="sender"></param>
		/// <param name="e"></param>
		private void MainWindow_Closing(object sender, System.ComponentModel.CancelEventArgs e)
		{
			/*if (MessageBox.Show("Close Application?", "Question", MessageBoxButton.YesNo, MessageBoxImage.Warning) == MessageBoxResult.No)
			{
				// Cancel Closing
				e.Cancel = true;
				return;
			}*/
		}
	}
}
