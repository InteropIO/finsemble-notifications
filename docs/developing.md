### Developing the Notification Service:

The instructions are similar to running the project, however this sets up a watch 

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

1. Keep all your edits in sync by running `npm run watch`.
3. You will need to install some packages in your seed for it to work. `npm install uuid date-fns immutable searchjs`
2. In your seed project, run as normal `npm run dev`.

After running `npm run watch`, all changes your make in this project will be copied into your finsemble seed project and any changes will be put into the next build. 
