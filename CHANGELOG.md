# Changelog

## [Unreleased]
### Added
  - Notifications have their own storage topic 
  - Notifications can now be purged based on values in the config
  - Updated documentation to explain types better


## [V0.1 - Prototype Phase 1]
### Added
 - New callback type definitions specify params expected on client responses

### Modified
  - Toasts no longer make the system slow down
  - `ISubscription.onNotification` is now of type `OnNotificationCallback`
  - `NotificationClient.subscribe` 2nd and third params are of type `OnSubscriptionSuccessCallback` and 
  `OnSubscriptionFaultCallback` respectively 
  - cssClassname field is now part of INotification rather than meta
  - notificationAlertSound field is now part of INotification rather than meta
  - Removed console.logs and updated errors to use the Central Logger too
  - Invisible window caused by toasts fixed
  - Toasts now ordered by newest at the bottom
  - Toast no longer go beyond the height of the monitor
  - vscode dir also ignored
  - all service logs now changed to info level 
  - Svg examples no longer inline
  - removed deprecated config
  - notification header text now displays in toasts instead of type
  - .Net example config path name changed from 
  - .Net Lists references changed to IList
  - .Net Dictionary references to IDictionary
  - .Net now uses getters and setters
  

### Known issues

  - Notification drawer animation does not toggle in and out
  - Notification center not in memory by default
  - Notifications toasts are missing an indicator that there are more notifications above the top of the screen
  - Notification toaster support for multiple screens 

## [pre-phase-1-alpha] - 2020-03-02
### added
 - Core notification service added
 - ability to unsubscribe from all subscriptions on the client instance.
 - ability to unsubscribe from a single subscription using subscription id
 - can subscribe to incoming notifications and receive them in real time (using an optional filter). 
 - able to send notifications to subscribed clients.
 - able to perform actions: DISMISS, SNOOZE, SPAWN, QUERY, PUBLISH, TRANSMIT
 - can get the timestamp for the last issued notifications. Given a source it will get the last issued timestamp from 
 that source 
 - can fetch historic notifications previously sent to the system.
 - new floating Toaster component
 - new toasts component 
 - new notification center
 - new notification drawer
 - .net client parity with TypeScript
 - example custom actions service
 - example subscription component
 - example notifier component
 - Configuration to send notification to the desktop (WebApi) using a filter
 - Support for notification default values and types via config 
 - Allow custom notification styling


