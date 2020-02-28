# The Notification Toaster
![Toaster](https://i.imgur.com/uIdPuY0.png)

The Toaster is a portable component that has multiple functionalities. 
The first thing to note are the toasters icons. The first icon is the drag handle, by clicking and holding on this area you can move the toaster around. The next three icons are buttons. The button icon on the far right (the last one) is a settings button, this currently is unused and will be wired up in a future release. The other two-button icons from left to right are:

**Notifications:** 
The notifications button has two functions. The first function is to display how many unread/unactioned notifications you have in the Notification Drawer and the other is to open the notification drawer on the same monitor as the toaster.

 **Notification Center:**
 This button's only function is to open the notification center on the same screen as the toaster. This saves the user time and searching for the Notification Center.

**_Tip:_**
If you can't find the toaster use the hotkey shortcut **CTRL+ALT+SHIFT+T** and it will appear where at your mouse position.
![](https://i.imgur.com/P86gRCg.png)
### Register the Notification Toaster with Finsemble

After following the steps outlined in the [setup](/README.md#setup), the most basic way to use this component is to 
include this components config your finsemble seed config file: `./finsemble-seed/configs/application/config.json`

```
  // Add the example components to your finsemble configuration
    "importConfig": [
        ...
        "$applicationRoot/components/finsemble-notifications/components/notification-toaster/config.json"
    ]
```
