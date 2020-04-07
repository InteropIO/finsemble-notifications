# Changelog

## [Unreleased]
### Added
 - New callback type definitions specify params expected on client responses

### Modified
  - `ISubscription.onNotification` is now of type `OnNotificationCallback`
  - `NotificationClient.subscribe` 2nd and third params are of type `OnSubscriptionSuccessCallback` and 
  `OnSubscriptionFaultCallback` respectively 

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


