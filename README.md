# Finsemble Notifications
Notifications service and user interfaces for use with Finsemble

This project relies on the [Finsemble Seed Project](https://github.com/ChartIQ/finsemble-seed) to run.

##Running the Notification Service

### Using the Notification Service in your Seed Project.

As this is not part of the Finsemble core, there are some additional steps needed to get this working with your Finsemble seed. We recommend including it as a git submodule.

1. cd into your seed's components directory. `$ cd scr/components`
1. Add the project as a submodule `$ git submodule add git@github.com:ChartIQ/finsemble-notifications.git`
2. cd into the submodule directory: `cd finsemble-notifications`
3. Install the required packages to run `npm install --production`
5. Make sure your seed can transpile tsx by adding `"jsx": "react"` to your seed's `compilerOptions` in the `tsconfig.json`
6. Add the the notification config your finsemble seed config file: `./finsemble-seed/configs/application/config.json`
``` 
"importConfig": [
    ...
    "$applicationRoot/components/finsemble-notifications/config.json",
    "$applicationRoot/components/finsemble-notifications/sample.config.json"
]
```

_**Note:** sample.config.json includes debug components and services that give examples of sending, receiving and 
performing custom actions notifications. This should be omitted in production environments.
config.json includes the entire suite of notification components_  

Alternatively, if you wish to use only specific components, you will need to follow the following method:
``` 
"importConfig": [
    // This config is required for notifcations to funtion.
    "$applicationRoot/components/finsemble-notifications/services/notification/config.json"
    ...
    // Select from the configs below to customise the experience.
    "$applicationRoot/components/finsemble-notifications/components/notification-center/config.json",
    "$applicationRoot/components/finsemble-notifications/components/notification-drawer/config.json",
    "$applicationRoot/components/finsemble-notifications/components/notification-toasts/config.json",
]
```

You should now be ready to build the source in your seed!


### Developing the Notification Service:
1. git clone this project 
2. Run `npm install`
3. Copy `example.copy.config.json` to `copy.config.json`
4. Make sure the `source` path in `copy.config.json` points to this project
5. The `destination` path should point to a directory inside your `finsemble-seed` components directory.
6. In your finsemble seed project, add the following to your `./finsemble-seed/configs/application/config.json`:
``` 
"importConfig": [
    ...
    "$applicationRoot/components/finsemble-notifications/config.json",
    "$applicationRoot/components/finsemble-notifications/sample.config.json"
]
```
Note: // sample.config.json includes debug components and services that give examples 
      // of sending reciveing and perfoming custom actions notificaions could be  

Alternatively if you wish to use only specific components

1. Keep all your edits in sync by running `npm run watch`.
3. You will need to install some packages in your seed for it to work. `npm install uuid date-fns immutable searchjs`
2. In your seed project, run as normal `npm run dev`.



After running `npm run watch`, all changes your make in this project will be copied into your finsemble seed project and any changes will be put into the next build. 


