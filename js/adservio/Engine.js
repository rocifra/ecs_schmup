var adservio;
(function (adservio) {
    class Engine {
        constructor(engineConfig, canvasContainer) {
            //signals
            this.onAssetsLoadComplete = new sb.signals.Signal0();
            //stats / debugers
            this.lastEngineUpdateTime = 0;
            this.lastLogicUpdateTime = 0;
            this.lastRenderUpdateTime = 0;
            //
            this._registeredScreens = {};
            //bools
            this._debugMode = false;
            this._isSwitching = false;
            //
            this._contentScalingEnabled = false;
            this._stageBaseWidth = 0;
            this._stageBaseHeight = 0;
            this._currentStageScaleRatio = 1;
            this.resizeToCanvas_handler = () => {
                //measure canvas size
                let rect = this.canvas.getBoundingClientRect();
                Logger.log("Resizing renderer to canvas size: ", rect.width, rect.height);
                this.renderer.resize(rect.width, rect.height);
                //alert(this.canvas.width+" "+ this.canvas.height);
                //check if portrait or landscape
                this._isPortraitView = rect.width <= rect.height;
                if (this._contentScalingEnabled) {
                    if (this._isPortraitView) {
                        this._currentStageScaleRatio = rect.width / this._stageBaseWidth;
                        Logger.log("Portrait mode detected. Scaling stage to full width [scaleRatio: " + this._currentStageScaleRatio + "] and resize on height. ");
                        //scale to full width
                        this.stage.width = this._stageBaseWidth;
                        this.stage.scale.set(this._currentStageScaleRatio);
                        this.stage.height = rect.height / this._currentStageScaleRatio; // / scaleRatio;
                    }
                    else {
                        this._currentStageScaleRatio = rect.height / this._stageBaseHeight;
                        Logger.log("Landscape mode detected. Scaling stage to full height [scaleRatio: " + this._currentStageScaleRatio + "] and resize on width. ");
                        //scale to full height
                        this.stage.height = this._stageBaseHeight;
                        this.stage.scale.set(this._currentStageScaleRatio);
                        this.stage.width = rect.width / this._currentStageScaleRatio;
                    }
                }
                else {
                    this.stage.width = this.renderer.screen.width;
                    this.stage.height = this.renderer.screen.height;
                }
                // var ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>this.canvas.getContext('2d');
                //alert("Baking store - " + this.canvas.width)
                // alert("Baking store - " + this.canvas.height)
                //alert(this._currentStageScaleRatio)
                Logger.log("New stage size -> width: " + this.stage.width + " | height: " + this.stage.height);
            };
            this.update = (deltaMS, deltaSC) => {
                let engineUpdateBeginTime;
                let beginTime;
                engineUpdateBeginTime = beginTime = performance.now();
                //update logic timeline
                this.logicTimeline.update(deltaMS, deltaSC);
                this.lastLogicUpdateTime = performance.now() - beginTime;
                beginTime = performance.now();
                //render
                this.renderer.render(this.stage);
                this.lastRenderUpdateTime = performance.now() - beginTime;
                if (this._debugMode) {
                    this.memoryProfiler.update(deltaMS, deltaSC);
                }
                this.lastEngineUpdateTime = performance.now() - engineUpdateBeginTime;
            };
            this.onPreloaderAssetsLoaded = () => {
                //display the cavans inside the dom
                TweenMax.set(this.canvas, { opacity: 0 });
                this._canvasContainer.appendChild(this.canvas);
                //trigger renderer resize to canvas
                this.resizeToCanvas_handler();
                //game bg
                this._stageBackground = PIXI.Sprite.fromImage('background_blue');
                this._stageBackground.width = this.stage.width;
                this._stageBackground.height = this.stage.height;
                this.stage.addChild(this._stageBackground);
                //create screen layers (containers)
                this._screenContainer = new sb.pixi.display.Container(this.stage.width, this.stage.height);
                this.stage.addChild(this._screenContainer);
                this._uiOverlayContainer = new sb.pixi.display.Container(this.stage.width, this.stage.height);
                this.stage.addChild(this._uiOverlayContainer);
                //start the engine
                this.start();
                TweenMax.to(this.canvas, 1, { opacity: 1, onComplete: this.loadAssets });
            };
            //load assets and track progress
            this.loadAssets = () => {
                //create and register the load progress screen
                this.registerScreen("LOAD_PROGRESS_SCREEN", new adservio.LoadingScreen());
                //this.registerScreen("GAME_STATE_SCREEN", new adservio.LoadingScreen());
                //display the screen
                this.switchToScreen("LOAD_PROGRESS_SCREEN", () => {
                    //enqueue runtime assets
                    this.enqueueAssets(this.engineConfig.runtimeAssets, this.assets);
                    //enqueue game assets
                    this.enqueueAssets(this.engineConfig.gameAssets, this.assets);
                    this.assets.onAssetsLoadCompleted.addOnce(this.onAssetsLoaded);
                    this.assets.beginLoad();
                });
            };
            this.onAssetsLoaded = () => {
                //create ui overlay
                this._uiOverlay = new adservio.AdservioUIOverlay(this, this._uiOverlayContainer);
                //dispatch signal
                this.onAssetsLoadComplete.dispatch();
            };
            this.enqueueAssets = (jsonList, assetsmanager) => {
                for (var key in jsonList)
                    if (jsonList.hasOwnProperty(key))
                        assetsmanager.add(key, jsonList[key]);
            };
            this.switchToScreen = (name, callback, params) => {
                if (!this._isSwitching) {
                    Logger.log("Switching to scene: ", name);
                    this._isSwitching = true;
                    if (this.currentScreen) {
                        var prevScene = this.currentScreen;
                        //remove previous screen
                        prevScene.animateOut(() => {
                            //remove screen display object from stage
                            prevScene.parent.removeChild(prevScene);
                            //detach timeline
                            this.logicTimeline.remove(prevScene.timeline.update);
                            //deactivate scene
                            prevScene.onDeactivated.dispatch();
                        });
                    }
                    //add next screen to container and animateIn
                    this.currentScreen = this._registeredScreens[name];
                    if (this.currentScreen) {
                        //init screen if not already
                        if (!this.currentScreen.initialized)
                            this.currentScreen.initialize(this);
                        //attach timeline
                        this.logicTimeline.add(this.currentScreen.timeline.update);
                        this._screenContainer.addChild(this.currentScreen);
                        this.currentScreen.onActivated.dispatch(params);
                        this.currentScreen.animateIn(() => {
                            //consider switch complete
                            this._isSwitching = false;
                            if (callback)
                                callback();
                            Logger.log("Scene switch complete");
                        });
                    }
                    else {
                        Logger.warn(`A scene with name: ${name} was not found!`);
                    }
                }
                else {
                    Logger.warn(`Cannot switch to scene ${name}. A scene change is already in progress `);
                }
            };
            this.registerScreen = (name, screenInstance) => {
                if (this._registeredScreens.hasOwnProperty(name)) {
                    Logger.warn("Duplicate scene name!");
                    return;
                }
                //register to dictionary
                this._registeredScreens[name] = screenInstance;
            };
            this.start = () => {
                this.mainClock.start();
                // this.renderClock.start();
                //this.engineClock.start();
                //  this.logicClock.start();
            };
            //store refs
            this.engineConfig = engineConfig;
            this._debugMode = engineConfig.debugConfig.debugMode;
            this._canvasContainer = canvasContainer;
            //detect isMobile
            if (engineConfig.forceMobile) {
                this._isMobile = true;
            }
            else {
                this._isMobile = isMobile.any;
            }
            Logger.log("Detecting mobile device: ", this._isMobile);
            if (engineConfig.viewportConfig) {
                Logger.log("Viewport content scaling enabled! Content 'baseWidth': ", engineConfig.viewportConfig.baseWidth, " | 'baseHeight': ", engineConfig.viewportConfig.baseHeight);
                //enable content scaling
                this._contentScalingEnabled = true;
                this._stageBaseWidth = engineConfig.viewportConfig.baseWidth;
                this._stageBaseHeight = engineConfig.viewportConfig.baseHeight;
            }
            else
                this._contentScalingEnabled = false;
            //setup clocks          
            this.mainClock = new sb.time.Clock();
            this.mainClock.timeline.add(this.update);
            this.logicTimeline = new sb.time.ClockTimeline();
            //init pixi a pixi loader instances
            this.preloaderAssets = new sb.pixi.AssetsManager();
            this.assets = new sb.pixi.AssetsManager();
            //init sound manager
            this.soundManager = new sb.pixi.SoundManager(this.assets);
            //init webgl renderer
            var rendererOptions = engineConfig.rendererConfig;
            //set resolution
            if (window.devicePixelRatio > 2)
                rendererOptions.resolution = 2;
            else
                rendererOptions.resolution = window.devicePixelRatio;
            this.renderer = new PIXI.WebGLRenderer(rendererOptions);
            //create a stage
            this.stage = new sb.pixi.display.Container();
            //render one frame with the stage 
            this.renderer.render(this.stage);
            //get canvas reference
            this.canvas = this.renderer.view;
            if (this._debugMode) {
                this.memoryProfiler = new sb.debug.MemoryProfiler();
                this.memoryProfiler.updateIntervalMS = 100;
                this.debugSampler = new sb.debug.Sampler();
                this.debugSampler.registerSampler("fps", "FPS:", this.mainClock, "FPS", 30, 1);
                this.debugSampler.registerSampler("engineUpdate", "ENGINE UPDATE TIME (MS):", this, "lastEngineUpdateTime", 2, 1, 2);
                this.debugSampler.registerSampler("renderTime", "RENDER TIME (MS):", this, "lastRenderUpdateTime", 2, 1, 2);
                this.debugSampler.registerSampler("logicTime", "LOGIC TIME (MS):", this, "lastLogicUpdateTime", 2, 1, 2);
                this.debugSampler.registerSampler("lifeSpan", "LIFE SPAN (S):", this.mainClock, "TOTAL_TIME", 1, 60, 0, 1000);
                this.debugSampler.registerSampler("heapSizeUsed", "HEAP SIZE USED (MB):", this.memoryProfiler, "jsUsedHeapSize", 2, 1, 2, 1024 * 1024);
                this.debugSampler.registerSampler("heapSizeTotal", "HEAP SIZE TOTAL (MB):", this.memoryProfiler, "jsTotalHeapSize", 1, 1, 2, 1024 * 1024);
                this.debugSampler.registerSampler("heapSizeDelta", "HEAP SIZE DELTA (KB):", this.memoryProfiler, "jsHeapSizeDelta", 1, 1, 2, 1024);
                this.debugSampler.registerSampler("heapSizeLimit", "HEAP SIZE LIMIT:", this.memoryProfiler, "jsHeapSizeLimit", 1, 1, 2, 1024 * 1024);
                this.debugSampler.domElement.style.position = "absolute";
                this.debugSampler.domElement.style.left = this.debugSampler.domElement.style.top = "0px";
                document.body.appendChild(this.debugSampler.domElement);
            }
            //setup user preferences manager
            this._userPreferencesManager = new adservio.UserPreferencesManager(this);
            //window resize listener
            window.addEventListener('resize', this.resizeToCanvas_handler, true);
            //init preload assets loading
            this.enqueueAssets(this.engineConfig.preloadAssets, this.preloaderAssets);
            this.preloaderAssets.onAssetsLoadCompleted.addOnce(this.onPreloaderAssetsLoaded);
            this.preloaderAssets.beginLoad();
        }
        get uiOverlay() { return this._uiOverlay; }
        get stageScaleRatio() { return this._currentStageScaleRatio; }
        get isMobile() { return this._isMobile; }
    }
    adservio.Engine = Engine;
})(adservio || (adservio = {}));
//# sourceMappingURL=Engine.js.map