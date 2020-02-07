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
		private NotificationClient notifier;

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
		}

		private void Notification_2_Click(object sender, RoutedEventArgs e)
		{
			
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
