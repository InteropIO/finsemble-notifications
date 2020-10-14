# Finsemble Notifications

A client, service and UI Finsemble extension to allow for a fuller Notification feature set.

This project requires the [Finsemble Seed Project](https://github.com/ChartIQ/finsemble-seed) to run.

## Table of Contents

**[Setup](#setup)**

- [Getting the Sourcecode](#getting-the-sourcecode)
- [Finsemble Config](#finsemble-config)
- [Selective Finsemble Config](#selective-finsemble-config)

**[Configuring the Notifications](#configuring-the-notifications)**

- [Configuring the Service](#configuring-the-service)
  - [Notification Types](#notification-types)
  - [Persistence](#persistence)
  - [Storage](#storage)
  - [Send Notifications to the OS](#send-notifications-to-the-os)
- [Configuring the Components](#configuring-the-components)

**[Using the Notifications API](#using-the-notifications-api)**

- [Sending Notifications](#sending-notifications)
- [Receiving Notifications](#receiving-notifications)
- [Muting Notifications](#muting-notifications)
- [Custom Actions](#custom-actions)
- [.Net Notifications client](#dot-net-client)

**[Making changes to this project?]()**

- [how to setup the project up for development](./docs/developing.md)

**[RDP Support](#rdp-support)**

## Setup

Getting the Finsemble notification code running and transpiling in your Finsemble seed project.

**Note: We suggest working directly with the source code. This effectively means checking out the notifications source
code, getting it into your own project and building the source as part of your normal process. We're doing it this way
as part of the initial release. As part of your feedback we'd like to know your thoughts on where you felt the need to
customise or use only parts of the package. This will help us inform to better separate or distribute the package in
future phases**

### Getting the Sourcecode

1. git clone this project into the directory of your choice.
1. run `npm install` to install dependencies needed for the copy script.
1. Copy `example.copy.config.json` to `copy.config.json`
1. Edit `copy.config.json`:
   1. Make sure `source` path points to this project
   1. Change the `destination` path to point to a directory inside your `finsemble-seed` components directory (It will
      create the directory if one does not exist).
1. You're now setup to copy. Running `npm run copy-files` should now have copied all the required files in your
   seed project.
1. Your seed will likely be missing some of the required packages for this to run.
   `npm install uuid date-fns immutable searchjs lodash.get react-transition-group @types/react @types/lodash.get`.
1. Modify your typescript config by adding `"jsx": "react"`, `"allowJs": true` and `"esModuleInterop": true` to your
   seed's `compilerOptions` in the `tsconfig.json`
1. In the seed, edit _./build/webpack/defaultWebpackConfig.js_ in the section for the `ts-loader`, set `"test": /\.ts(x)?$/` if it's not already.

### Finsemble Config

You now have the source in your seed. Now you need to tell Finsemble to use it.
Add the notification config your finsemble seed config file: `./finsemble-seed/configs/application/config.json`

```
"importConfig": [
    ...
    "$applicationRoot/components/finsemble-notifications/config.json"
]
```

This line will add the Notifications Service, Notification Center, Toasts, toaster and drawer to your project.

### Selective Finsemble Config

Alternatively, if you want to customise your experience and incorporate only some of the components, you'd want to use something like:

```
"importConfig": [
    // This config is required for notifications to function.
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

Certain directives can be provided to the notifications service.
You can do this by adding a `notifications` object to the `servicesConfig` object in `./configs/application/config.json` in the finsemble seed.
All service configuration is optional.

#### Notification Types

Defining a notification type is the quickest method of applying a set of behaviours to many notifications at once.
Defining a type in the config, will mean that when a notification with the corresponding `INotification.type` set, the 
values specified in the config will be applied on any empty fields. In practice this means notifications of a specific 
type, without any work other than setting the type, can all have the same css class, logo, header text, (sound in the 
future), etc.

Specifying the `default` type will apply these values as defaults to all notifications sent, provided that they do not
match any other notifications types specified in the config.

You can do this by adding to the `servicesConfig.notifications.types` object in `./configs/application/config.json` in
the finsemble seed:

**showDismissAction** _[default: false]_ Adds a dismiss action to the Notification if one is not already present.
**defaultDismissButtonText:** _[Default: Dismiss]_ The dismiss button text if one needs to be added.
**defaults** _[default: {}]_ Sets the values on a notification if it has not already been set. All fields specified here
should match those on the INotification interface.

Example type definition:

```
{
    "servicesConfig": {
        "notifications": {
            "types": {
                "notification-type-name": {
                    "defaultDismissButtonText": "Default Button Text",
                    "showDismissAction": true,
                    "defaults": {
                        "timeout": 2000,
                        "headerLogo": "toast logo",
                        "contentLogo": "toast content logo",
                        "cssClassName": "cssClassName",
                        "meta": {
                            "anykey": "anyvalue",
                            "anykey2": "anyvalue2",
                            "anykey3": "anyvalue3",
                        }
                    }
                },
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
                }
            }
        }
    }
}
```

#### Persistence

By default, finsemble will store a maximum of 1000 notifications. If no new notifications are sent, it will keep these
1000 notifications in storage forever. These directives can be changed on the `notifications` object on the
`servicesConfig` object in `./configs/application/config.json`:

**maxNotificationsToRetain:** _[Default: 1000]_ The number of notifications to store.
**maxNotificationRetentionPeriodSeconds** _[default: false]_ - The number of seconds the service should keep a
notification in storage since that notification's last updated time.

_**Note:** Notifications are not actively purged. Rather, as a new notification comes in the collection is evaluated for
notifications to purge from storage_

```
{
    "servicesConfig": {
        ....
        "notifications": {
            "maxNotificationsToRetain": 1000,
            "maxNotificationRetentionPeriodSeconds": 86400
        }
    }
}

```

#### Storage

Finsemble notification gets persisted using the `finsemble.notifications` storage topic. To change which storage adapter
notifications will use, set the appropriate value by adding the `finsemble.notifications` key to the
`servicesConfig.storage.topicToDataStoreAdapters` object in `./configs/application/config.json` in the finsemble seed:

```
{
    "servicesConfig": {
        "storage": {
            "topicToDataStoreAdapters": {
                ...
                "finsemble.notifications": "IndexedDBAdapter"
            }
        }
    }
}
```

#### Send Notifications to the OS

Using the config, you can also send your notifications to the OS. Do this by specifying the `proxyToWebApiFilter` on 
the `notifications` object on the `servicesConfig` object in `./configs/application/config.json`. For more information 
on filtering see the section on [Fetching and Receiving Notifications](/components/subscriber/Readme.md)

Example filter:

```
{
    "servicesConfig": {
        "notifications": {
            "proxyToWebApiFilter": {
                "include": [{
                    "type": "web"
                }],
                "exclude": []
            }
        }
    }
}
```

#### Example Psuedo Config

```
{
    ...
    "servicesConfig": {
        ...
        "storage": {
            "topicToDataStoreAdapters": {
                ...
                // Sets the storage adapter for notification persistance
                "finsemble.notifications": "IndexedDBAdapter"
            }
        }
        "notifications": {
            // The maximum number of notifications the service should store in memory
            "maxNotificationsToRetain": 1000,
            // The maximum
            "maxNotificationRetentionPeriodSeconds": 86400
            // Broadcast any notifications that match this filter to the Notification Web API to appear in the OS.
            // See 'Receiving Notifications' for more details
            "proxyToWebApiFilter": {
                "include": [{
                    "type": "web"
                }],
                "exclude": []
            },

            // If the service needs to add dismiss actions to the button. The text will default
            // to the value set here as a last resort. There is a hardcoded value if this not set.
            "defaultDismissButtonText": "Dismiss",
            // 'types' provide a way of setting default values on notifications based on the INotification.type
            "types": {
                // object key 'toast' corresponds to INotification.type = 'toast'.
                // The values inside the `toast` object will only be applied to notifications the property 'type' set to 'toast'.
                "toast": {
                    // Will add a dismiss action to the Notification if one is not already set.
                    "defaultDismissButtonText": "Default Button Text",
                    // Add a dismiss action to the notification if one does not exists. Default set to false
                    "showDismissAction": true,
                    // For any values on a notification not already set, these default values will be set on the Notification object.
                    "defaults": {
                        // All fields in here should match those in the INotification interface.
                        "timeout": 2000,
                        "headerLogo": "toast logo",
                        "contentLogo": "toast content logo"
                        "cssClassName": "cssClassName",
                        "meta": {
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

Some Notification component behaviours can be changed via configuration. To change this behaviour you will need to
change the component configuration entry. The standard configuration provided lumps in all the configurations so if
modifying the behaviour is what you are after, you will need to configure the components at an individual level. To do
this, import the service and any components of which you DO NOT want to modify the behaviour using the method outlined
in the in the [selective configuration method](#selective-finsemble-config). Following this, for any component configs
you wish to modify, create and change your own component configs using the following as base:

- [notification-center config](components/notification-center/config.json)
- [notification-drawer config](components/notification-drawer/config.json)
- [notification-toaster config](components/notification-toaster/config.json)
- [notification-toasts config](components/notification-toasts/config.json)

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

### Muting Notifications

Notifications are designed to grab the user's attention to something that occurred within the system. This most
effective attention way this is achieved when a Notification toast pops up from off-screen. If the information presented
in the Toast is not important and this unimportant information grabs the user's attention too frequently, it can be
distracting and may hindering the user in doing their actual task. There are two ways to control this behaviour. The
first, for developers, is the via the Toast filter config, and the second is user controlled muting.

#### Toast Config

The toasts can be the main source of distraction for the user. It might be the case you wish to send a notification but
not have it pop-up and grab the user's attention. In this case, the you are able to send a notification with a specific
field defined internally with in your organisation identifying that this Notification is of low importance and configure
the Toasts component not to show this Notification. See below for an example:

**Define Your Notification:**
```typescript
// Creating the Notification
const client = new NotificationClient();

let notification = new Notification();
notification.title = "Notify world";

notification.source = "oms";
notification.type = "oms-informational-low";

client.notify(notification);
``` 

**Configure the Toasts to exclude the Notification**

Modify your [Toasts config](components/notify/config.json) to exclude any notifications with the source and/or type 
you defined earlier:

```
"notification-toasts": {
    "window": {
        ...
        "data": {
            "notifications": {
                "applyMuteFilters": true,
                "filter": {
                    "include": [],
                    "exclude": [{
                        source: "oms",
                        type: "oms-informational-low",
                    }]
                },
                ...
            }
        },
        ...
    },
    ...
}
```

#### User Controlled Muting

Users also have some ability to control what notifications are able to grab their attention. This is done via the
Notification actions overflow menu through muting. Users are able to mute Notifications based on their type, source, or 
type and source.

![Overflow Menu with Mute Option](components/notification-overflow-menu/Screenshot-mute.png?raw=true "Overflow Menu with Mute Option")

When a user mutes a notification, notifications that then pass through the System will then have the isMuted flag set to
true. The isMuted flag allows a specific user interface to be configure to either respect or ignore the muted state. 
This can be configured in the Notification UI config by changing the component's "applyMuteFilters" value to true. The
default  configuration is for the mute filters to only be applied to the toasts component.


Set the applyMuteFilters value.
```
"notification-toasts": {
    "window": {
        ...
        "data": {
            "notifications": {
                "applyMuteFilters": true,
                ...
            }
        },
        ...
    },
    ...
}
```

#### Muting preferences panel

Once a user has added a mute filter, they may wish to remove this mute filter. This can be done by adding the
Notification Preferences component to the User preferences component in your Finsemble Seed.

This is a manual process that a developer would need to implement. See the [recipe in the seed](https://github.com/ChartIQ/finsemble-seed/compare/release/4.5.0...recipes/add-notification-mute-to-preferences-panel)
for the code require to do this. 


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
not.headerText = "WPF minimal notification, no actions";
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

#### Example .Net notification component

An [example WPF component](dot-net-notifications/NotifyComponent) is provided that uses the FinsembleNotifications.dll and Finsemble.dll to send notifications and to subscribe to the notifications stream. Please build both the [NotifyComponent](dot-net-notifications/NotifyComponent) and [FinsembleNotifications.dll](dot-net-notifications/FinsembleNotifications) using the included [Visual Studio solution](dot-net-notifications).

Note: The example [configuration file](dot-net-notifications/NotifyComponent/config.json) makes use of a variable `$wpfNotificationExampleBase` set in the [sample config file](sample.config.json) to construct the path to the example executable. Set `$wpfNotificationExampleBase` such that the path in the [NotifyComponent config](dot-net-notifications/NotifyComponent/config.json) points to the built .exe file(s).

## RDP Support

Please note that notifications will work over RDP but will need a config update due to the way that transparency appears when running Finsemble on RDP.

If you are using any of the following UI elements:

- Drawer
- Toaster
- Toasts

You will need to make a change to the value `"transparent": true` to `"transparent": false` found in the **config file** for each UI element. The transparent value is located at **window.options.transparent**
see the exact line for the [toaster component
](https://github.com/ChartIQ/finsemble-notifications/blob/562278a8636f27a7f28d111e32fb292cf9c57c7b/components/notification-toasts/config.json#L33).

_\*Changing the visibility for the toaster will remove the round edges_
