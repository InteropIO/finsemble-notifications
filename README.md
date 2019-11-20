# Finsemble Notifications
Notifications service and user interfaces for use with Finsemble

This project relies on the [Finsemble Seed Project](https://github.com/ChartIQ/finsemble-seed) to run.

For development:
git clone 

`mklink /D c:\[path/to/seed]\src\components\finsemble-notifications c:\[path\to\cloned\repo]`

 


_Then add the following to your ./finsemble-seed/configs/application/config.json_
``` 
"importConfig": [
    ...
    "$applicationRoot/components/finsemble-notifications/config.json"
] 
```



Dev Notes

No tests written. testing the client is pretty much useless most of the business logic is in the service. Not testing the service as there are so many dependencies that need to be dealt with before the tests will run.
