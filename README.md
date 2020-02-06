# Finsemble Notifications
A client, service and UI Finsemble extension to allow for a fuller Notification feature set. 

This project requires the [Finsemble Seed Project](https://github.com/ChartIQ/finsemble-seed) to run.

## Table of Contents

**[Setup](#setup)**  
&nbsp;&nbsp;&nbsp;&nbsp;[Getting the Sourcecode](#getting-the-sourcecode)  
&nbsp;&nbsp;&nbsp;&nbsp;[Finsemble Config](#finsemble-config)  
&nbsp;&nbsp;&nbsp;&nbsp;[Selective Finsemble Config](#selective-finsemble-config)  
&nbsp;&nbsp;&nbsp;&nbsp;[Updating](#updating)  
**[Configuring the Notifications](#configuring-the-notifications)**  
&nbsp;&nbsp;&nbsp;&nbsp;[Configuring the Service](#configuring-the-service)  
&nbsp;&nbsp;&nbsp;&nbsp;[Configuring the Components](#configuring-the-components)   
**[Using the Notifications API](#using-the-notifications-api)**  
&nbsp;&nbsp;&nbsp;&nbsp;[Sending Notifications](#sending-notifications)  
&nbsp;&nbsp;&nbsp;&nbsp;[Receiving Notifications](#receiving-notifications)  
&nbsp;&nbsp;&nbsp;&nbsp;[Custom Actions](#custom-actions)  


---   
[Making changes to this project?](#making-changes-to-this-project)

---

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

```
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
See out the [notifier component example](components/notify)

### Receiving Notifications
See out the [Subscriber component example](components/subscriber)

### Custom Actions
See out the [Custom Action Service example](services/exampleCustomAction)

#### Making changes to this project?  
Follow the instructions [how to setup the project up for development](./docs/developing.md). 
