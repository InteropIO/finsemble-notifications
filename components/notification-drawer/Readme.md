# The Notification Drawer
![enter image description here](https://i.imgur.com/mIdsn7c.gif)
The Notification Drawer is a holding place for all your notifications that have not been snoozed or actioned. Any new notications will also be added to the top of this list.

### Register the Notification Drawer with Finsemble

After following the steps outlined in the [setup](/README.md#setup), the most basic way to use this component is to 
include this components config your finsemble seed config file: `./finsemble-seed/configs/application/config.json`

```
  // Add the example components to your finsemble configuration
    "importConfig": [
        ...
        "$applicationRoot/components/finsemble-notifications/components/notification-drawer/config.json"
    ]
```

### Customise the behaviour

Using [this component's default config](/components/notification-drawer/config.json) as a base to add a component entry 
into your `./finsemble-seed/configs/application/components.json`.

The notifications held in the drawer are styled by the cssName added to the notification when it's created. In order to style it the css string value attached to the cssName needs to be available either via css file, inline or via another hosted css file.

The drawer is designed to be responsive therefore it is governed by the config width for the component. If you wish to increase or decrease the width change the width property found under window in the config file for this component.
