# Finsemble Notifications
A client, service and UI Finsemble extension to allow for a fuller Notification feature set. 

This project requires the [Finsemble Seed Project](https://github.com/ChartIQ/finsemble-seed) to run.

## Table of Contents

**[Setup](#setup)**  
* [Getting the Sourcecode](#getting-the-sourcecode)  
* [Finsemble Config](#finsemble-config)  
* [Selective Finsemble Config](#selective-finsemble-config)  
* [Updating](#updating)  

**[Configuring the Notifications](#configuring-the-notifications)**  
* [Configuring the Service](#configuring-the-service)  
* [Configuring the Components](#configuring-the-components)   

**[Using the Notifications API](#using-the-notifications-api)**  
* [Sending Notifications](#sending-notifications)  
* [Receiving Notifications](#receiving-notifications)  
* [Custom Actions](#custom-actions)  
* [.Net Notifications client](#dot-net-client)

**[Making changes to this project?](#making-changes-to-this-project)**
* [how to setup the project up for development](./docs/developing.md)

## Setup

Getting the Finsemble notification code running and transpiling in your Finsemble seed project.  

### Getting the Sourcecode
The simplest method of adding notifications to your project and to facilitate an easy upgrade path,
we suggest adding the this project to your finsemble seed as a git submodule.

You can do this by doing the following:
1. cd into your seed's components directory. `$ cd scr/components`
1. Add the project as a submodule `$ git submodule add git@github.com:ChartIQ/finsemble-notifications.git`
2. cd into the submodule directory: `cd finsemble-notifications`
3. Install the required packages to run `npm install --production`
5. Make sure your seed can transpile tsx by adding `"jsx": "react"` to your seed's `compilerOptions` in the `tsconfig.json`
5. In the seed, edit _./build/webpack/defaultWebpackConfig.js_ in the section for the `ts-loader`, set `"test": /\.ts(x)?$/` if it's not already.

### Finsemble Config
You now have the source in your seed. Now you need to tell Finsemble to use it.  
Add the notification config your finsemble seed config file: `./finsemble-seed/configs/application/config.json`
``` JSON
"importConfig": [
    ...
    "$applicationRoot/components/finsemble-notifications/config.json"
]
```

This line will add the Notifications Service, Notification Center, Toasts, toaster and drawer to your project. 

### Selective Finsemble Config
Alternatively, if you want to customise your experience and incorporate only some of the components, you'd want to use something like:

```JSON
"importConfig": [
    // This config is required for notifcations to funtion.
    "$applicationRoot/components/finsemble-notifications/services/notification/config.json"
    ...
    // Select from the configs below to customise the experience.
    "$applicationRoot/components/finsemble-notifications/components/notification-center/config.json",
    "$applicationRoot/components/finsemble-notifications/components/notification-drawer/config.json",
    "$applicationRoot/components/finsemble-notifications/components/notification-toaster/config.json",
    "$applicationRoot/components/finsemble-notifications/components/notification-toasts/config.json"
]
```

You should now be ready to build and run the notifications in your seed!

    $  npm run dev

## Configuring the Notifications

Providing defaults and changing the behaviour of the Service and Components

### Configuring the Service
Certain directives can be provided to the service. 
You can do this by adding a `notifications` object to the `servicesConfig` object in `./configs/application/config.json` in the finsemble seed.
All the configuration below is optional:

```JSON
{
    ...
    "servicesConfig": {
        ...
        "notifications": {
            // Broadcast any notifications that match this filter to the Notication Web API to appear in the OS.
            // See 'Receiveing Notifications' for more details
            "proxyToWebAPiFilter": {
                "include": [{
                    "type": "web"
                }],
                "exclude": []
            },

            // If the service needs to add dismiss actions to the button. The text will default 
            // to the value set here as a last resort. There is a hardcoded value if this not set.
            "defaultDismissButtonText": "Dismiss",
            // 'types' provide a way of setting default values on notifications based on the INotifcaition.type 
            "types": {
                // object key 'toast' correspondes to INotification.type = 'toast'. 
                // The values inside the `toast` object will only be applied to notications the property 'type' set to 'toast'. 
                "toast": {
                    // Will add a dismiss action to the Notification if one is not already set.
                    "defaultDismissButtonText": "Default Button Text",
                    // Add a dismiss action to the nofication if one does not exists. Default set to false
                    "showDismissAction": true,
                    // For any values on a notification not already set, these default values will be set on the Notification object.
                    "defaults": {
                        // All fields in here should match those in the INotication interface. 
                        "timeout": 2000,
                        "headerLogo": "toast logo",
                        "contentLogo": "toast content logo"
                        "meta": {
                            // 'cssClassName' a reserved key and is used in the Notification component 
                            // to apply a customCss class to a notification.
                            "cssClassName": "cssClassName",
                            "anykey": "anyvalue",
                            "anykey2": "anyvalue2",
                            "anykey3": "anyvalue3",
                        }
                    }
                },

                // 'default' is a reserved name. If there any notifications with notification.type that
                // do not match any of the keys in the config. The values in default will be applied. 
                "default": {
                    "showDismissAction": true,
                    "defaultDismissButtonText": "Default Button Text",
                    "defaults": {
                        "timeout": 1234,
                        "headerLogo": "defaultHeaderLogo",
                        "contentLogo": "defaultContentLogo",
                        "title": "defaultTitle",
                        "details": "defaultDetails",
                        "headerText": "defaultHeaderText"
                    }
                },
                "anothertype": {
                    "showDismissAction": true
                }
            }
        }
    }
   ...
}
```

### Configuring the Components

Configuring Notification components is done in the component configuration itself. If this is something you need to do, 
need to configure the components at an individual level, you will need to do. You will need to import the
notifications using the [selective configuration method](#selective-finsemble-config), and using the provided configs as a base:  
* [notification-center config](components/notification-center/config.json)  
* [notification-drawer config](components/notification-drawer/config.json)  
* [notification-toaster config](components/notification-toaster/config.json)  
* [notification-toasts config](components/notification-toasts/config.json)  

## Using the Notifications API

This package includes two example components and an example service to give an example how to send, receive and 
performing custom actions on notifications.

### Running the examples

To run the examples make sure you've followed the steps outlined in the [setup](#setup) as well as adding the following to your config:
```
    // Add the example components to your finsemble configuration 
    "importConfig": [
        ...
        "$applicationRoot/components/finsemble-notifications/sample.config.json"
    ]
```

### Sending Notifications
See the [notifier component example](components/notify)

### Receiving Notifications
See the [Subscriber component example](components/subscriber)

### Custom Actions
See the [Custom Action Service example](services/exampleCustomAction)

### Dot Net Client
A .Net port of the notifications client, which allows WPF and Winforms-based components to send and receive notifications, and makes use of implementations of the Object types [Notification](dot-net-notifications/FinsembleNotifications/Notification.cs), [Action](dot-net-notifications/FinsembleNotifications/Action.cs), [Subscription](dot-net-notifications/FinsembleNotifications/Subscription.cs), [Filter](dot-net-notifications/FinsembleNotifications/Filter.cs) and [PerformedAction](dot-net-notifications/FinsembleNotifications/PerformedAction.cs). The client and Object implementations are provided as a separate DLL which is built by the [FinsembleNotifications project](dot-net-notifications/FinsembleNotifications). To use the client, import its namespace, and handle any namespace conflicts as below: 
```C#
using ChartIQ.Finsemble.Notifications;
using NAction = ChartIQ.Finsemble.Notifications.Action;
```
To instantiate the client, it must be passed an instance of the Finsemble bridge, provided by the main Finsemble DLL (available from [nuget](https://www.nuget.org/packages/Finsemble), see the [Finsemble dot-net-seed project](https://github.com/ChartIQ/finsemble-dotnet-seed) for further examples of use). This is best done inside the handler for the bridge's connected event:
```C#
    private void Finsemble_Connected(object sender, EventArgs e)
    {
        Application.Current.Dispatcher.Invoke(delegate //main thread
        {
            // Initialize this Window and show it
            InitializeComponent(); // Initialize after Finsemble is connected
            FinsembleHeader.SetBridge(FSBL); // The Header Control needs a connected finsemble instance

            //perform other setup here
            ...

            notifier = new NotificationClient(FSBL);

            this.Show();
        });
    }
```

You can then instantiate a notification Object and submit to the client:
```C#
Notification not = new Notification();
not.issuedAt = DateTime.Now;
not.source = "WPF NotifyComponent";
not.headerText = "WPF minmal notification, no actions";
not.details = "Should create a new notification in UI every time it's sent (from WPF)";
not.type = "email";
not.headerLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/email.svg";
not.contentLogo = "http://localhost:3375/components/finsemble-notifications/components/shared/assets/graph.png";

notifier.notify((new[] { not }), (s, r) => {
    FSBL.RPC("Logger.log", new List<JToken> {
        "Notification sent,\nnotification: " + not.ToString()
        + "\nresponse: " + (r.response != null ? r.response.ToString() : "null")
        + "\nerror: " + (r.error != null ? r.error.ToString() : "null")
    });
});
```
or subscribe to the notifications stream:
```C#
Subscription sub = new Subscription();
sub.filter = new Filter();
//sub.filter.include = new Dictionary<String, Object>();
//sub.filter.include.Add("type", "email");

EventHandler<FinsembleEventArgs> onSubHandler = (s, r) =>
{
    FSBL.RPC("Logger.log", new List<JToken> {
        "Subscription request sent,\nSubscription: " + sub.ToString()
        + "\nresponse: " + (r.response != null ? r.response.ToString() : "null")
        + "\nerror: " + (r.error != null ? r.error.ToString() : "null")
    });
    if (r.response != null)
    {
        //retrieve the subscription object that should now include a subscription id
        subscription = Subscription.FromJObject((JObject)r.response);
    }
};

EventHandler<Notification> onNotifyHandler = (s, r) =>
{
    FSBL.RPC("Logger.log", new List<JToken> {
        "Received Notification,\nnotification: " + r.ToString()
    });

    Application.Current.Dispatcher.Invoke(delegate //main thread
    {
        //do something with the received notification object
        NotificationData.Text = r.ToString();
    });
};

notifier.subscribe(sub, onSubHandler, onNotifyHandler);
```

#### Example .Net notification component ####
An [example WPF component](dot-net-notifications/NotifyComponent) is  provided that uses the FinsembleNotifications.dll and Finsemble.dll to send notifications and to subscribe to the notifications stream. Please build both the [NotifyComponent](dot-net-notifications/NotifyComponent) and [FinsembleNotifications.dll](dot-net-notifications/FinsembleNotifications)   using the included [Visual Studio solution](dot-net-notifications).

Note: The example [configuration file](dot-net-notifications/NotifyComponent/config.json) makes use of a variable `$wpfExampleBase` set in the [sample config file](sample.config.json) to construct the path to the example executable.   Set `$wpfExampleBase` such that the path in the [NotifyComponent config](dot-net-notifications/NotifyComponent/config.json) points to the built .exe file(s).