# Notification Icon


### Register the Notification Icon with Finsemble

After following the steps outlined in the [setup](/README.md#setup), the most basic way to use this component is to 
include this components config your finsemble seed config file: `./finsemble-seed/configs/application/config.json`

```
  // Add the example components to your finsemble configuration
    "importConfig": [
        ...
        "$applicationRoot/components/finsemble-notifications/components/notification-icon/config.json"
    ]
```

### Customise the behaviour

[what the customisations can do]

Using [this component's default config](/components/notification-icon/config.json) as a base to add a component entry 
into your `./finsemble-seed/configs/application/components.json`.

Change the following values to get the behaviour your need:

Set the css of each type by using the type name like so

    className={`notification-number type-count--${typeName}`}
The typeName will be the type of notification for example *"chat"*

    .type-count--chat {
	    background-color:yellow;
	    }
This will set the type count for chat to have a yellow background. These css rules need to be predetermined based on the type ahead of time, no css class and it will fall back to a default.
