declare namespace FSBL {
    let Clients: any;
    let addEventListener: any;
}

declare type Finsemble = {
    Clients: {
        AuthenticationClient: any,
        ConfigClient: any,
        DialogManager: any,
        DistributedStoreClient: any,
        DragAndDropClient: any,
        HotkeyClient: any,
        LauncherClient: any,
        LinkerClient: any,
        Logger: any,
        RouterClient: any,
        SearchClient: any,
        StorageClient: any,
        WindowClient: any,
        WorkspaceClient: any
    };
}
