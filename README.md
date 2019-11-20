# Finsemble Notifications
Notifications service and user interfaces for use with Finsemble

This project relies on the [Finsemble Seed Project](https://github.com/ChartIQ/finsemble-seed) to run.

For development:
1. git clone this project 
2. Run `npm install`
3. Copy `example.copy.config.json` to `copy.config.json`
4. Make sure the `source` path in `copy.config.json` points to this project
5. The `destination` path should point to a directory inside your `finsemble-seed` components directory.
6. In your finsemble seed project, add the following to your ./finsemble-seed/configs/application/config.json (make sure the directories match)
``` 
"importConfig": [
    ...
    "$applicationRoot/components/finsemble-notifications/config.json"
]
```

1. Run `npm run watch`
2. In your seed project you can as normal run `npm run dev`.

After running `npm run watch`, all changes your make in this project will be copied into your finsemble seed project and any changes will be put into the next build. 
