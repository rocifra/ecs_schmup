interface IEngineConfig
{
    forceMobile?: boolean
    debugConfig: {
        debugMode: boolean
    }
    viewportConfig?: {
        baseHeight: number
        baseWidth: number
    }
    rendererConfig: {
        width: number
        height: number
        antialias: boolean
        autoResize: boolean
        backgroundColor: number
        roundPixels: boolean
    }
    uiOverlay: {
        menuScreenID: string
        statsModules: IStatsModuleConfig[]
    }
    preloadAssets: { [label: string]: string }
    runtimeAssets: { [label: string]: string }
    gameConfig: { [label: string]: any }
    gameAssets: { [label: string]: string }
    gameStrings: IGameStrings

}