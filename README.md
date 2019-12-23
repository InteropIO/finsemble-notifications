# Finsemble Notifications
Notifications service and user interfaces for use with Finsemble

This project relies on the [Finsemble Seed Project](https://github.com/ChartIQ/finsemble-seed) to run.

##Running the Notification Service

### Using the Notification Service in your Seed Project.

As this is not part of the Finsemble core, there are some additional steps needed to get this working with your Finsemble seed. We recommend including it as a git submodule.

1. cd into your seed's components directory. `$ cd scr/components`
1. Add the project as a submodule `$ git submodule add git@github.com:ChartIQ/finsemble-notifications.git`
2. cd into the submodule directory: `cd finsemble-notifications`
3. Install the required packages to run `npm install` this should ideally be (`npm install --production`)
5. Make sure your seed can transpile tsx by adding `"jsx": "react"` to your seed's `compilerOptions` in the `tsconfig.json`

You should now be ready to build the source in your seed.

_**TODO: make it so we run `npm install --production`. All and only libraries required for running are moved from devDependencies in package.json**_

To use the Notification Service, you'll need to add the the services to your config.

1. In your finsemble seed project, add the following to your `./finsemble-seed/configs/application/config.json`
``` 
"importConfig": [
    ...
    "$applicationRoot/components/finsemble-notifications/config.json",
]

Also add "$applicationRoot/components/finsemble-notifications/sample.config.json" 
if you want some example components to play around with
```

**_TODO: Split into 2 or 3 configs: ui-only/services-only_**


### Developing the Notification Service:
1. git clone this project 
2. Run `npm install`
3. Copy `example.copy.config.json` to `copy.config.json`
4. Make sure the `source` path in `copy.config.json` points to this project
5. The `destination` path should point to a directory inside your `finsemble-seed` components directory.
6. In your finsemble seed project, add the following to your ./finsemble-seed/configs/application/config.json (make sure the directories match)
7. If you wish to use the example components and action services add the following to your ./finsemble-seed/configs/application/sample.config.json (make sure the directories match)
``` 
"importConfig": [
    ...
    "$applicationRoot/components/finsemble-notifications/config.json",
    "$applicationRoot/components/finsemble-notifications/sample.config.json"
]
```

1. Run `npm run watch`
2. In your seed project you can as normal run `npm run dev`.



After running `npm run watch`, all changes your make in this project will be copied into your finsemble seed project and any changes will be put into the next build. 


