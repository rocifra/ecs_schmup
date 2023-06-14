var adservio;
(function (adservio) {
    class AdservioUIOverlay extends sb.pixi.display.Container {
        constructor(engine, container) {
            super();
            this._isHidden = false;
            this._statsModulesDictionary = {};
            this._statsModules = new Array();
            this._statsModuleHorizontalPadding = 5;
            this._statsModuleHeight = 34;
            this._renderScale = 1;
            this.buildUI = () => {
                //menu container
                this._menuContainer = new sb.pixi.display.Container(this.width, 60);
                this.addChild(this._menuContainer);
                //modular stats container
                this._modularStatsContainer = new sb.pixi.display.Container(2, 60);
                //this._modularStatsContainer.showBounds(0xCCC000);
                this._modularStatsContainer.x = 10; //this.width - 60;
                this._menuContainer.addChild(this._modularStatsContainer);
                this._pauseButton = new PIXI.Sprite(this._engine.assets.getTexture("pause_icon"));
                this._pauseButton.width = this._pauseButton.height = 50;
                this._pauseButton.y = (this._menuContainer.height - this._pauseButton.height) / 2;
                this._pauseButton.x = this._menuContainer.width - this._pauseButton.width - 10;
                this._pauseButton.interactive = true;
                this._pauseButton.buttonMode = true;
                this._pauseButton.on('pointerdown', this.pauseButtonPointerDown_handler);
                this._menuContainer.addChild(this._pauseButton);
                //build stats modules
                var statsModulesArray = this._engine.engineConfig.uiOverlay.statsModules;
                for (let i = 0; i < statsModulesArray.length; i++) {
                    this.buildStatsContainer(statsModulesArray[i]);
                }
            };
            this.pauseButtonPointerDown_handler = () => {
                this._engine.switchToScreen(this._engine.engineConfig.uiOverlay.menuScreenID, null, adservio.GameStates.PAUSE);
            };
            this.buildStatsContainer = (moduleConfig) => {
                var statsModule = new StatsModule(moduleConfig, this._engine.assets.getTexture("9slice_stats_module_bg", this._renderScale));
                var lastAddedStatsModule;
                var targetX = 0;
                //get last added statsModule
                if (this._statsModules.length > 0) {
                    lastAddedStatsModule = this._statsModules[this._statsModules.length - 1];
                    targetX = lastAddedStatsModule.x + lastAddedStatsModule.width;
                }
                else {
                    targetX = 0; //- statsModule.width;
                }
                statsModule.x = targetX + this._statsModuleHorizontalPadding;
                statsModule.y = (this._modularStatsContainer.height - statsModule.height) / 2;
                //add to container and update it's width
                this._modularStatsContainer.addChild(statsModule);
                // this._modularStatsContainer.width += statsContainer.width;
                // this._modularStatsContainer.x = this.width - 80 - this._modularStatsContainer.width;
                //push to array
                this._statsModules.push(statsModule);
                //add to dic
                this._statsModulesDictionary[moduleConfig.id] = statsModule;
            };
            this.show = (delay = 0, callback) => {
                if (!this._isHidden) {
                    //enable button
                    this._pauseButton.interactive = true;
                    //prep animation
                    this._menuContainer.y = -this._menuContainer.height;
                    this._menuContainer.alpha = 0;
                    this._attachContainer.addChild(this);
                    this._isHidden = true;
                    TweenMax.to(this._menuContainer, 1, { alpha: 1, y: 0, delay: delay, ease: Expo.easeInOut, onComplete: callback });
                }
            };
            this.hide = (delay = 0, callback) => {
                if (this._isHidden) {
                    this._isHidden = false;
                    //disable button
                    this._pauseButton.interactive = false;
                    TweenMax.to(this._menuContainer, 0.5, {
                        alpha: 0, y: -this._menuContainer.height, delay: delay, ease: Expo.easeInOut, onComplete: () => {
                            this.parent.removeChild(this);
                            if (callback)
                                callback();
                        }
                    });
                }
            };
            this.getStatsModuleReference = (id) => {
                if (this._statsModulesDictionary.hasOwnProperty(id))
                    return this._statsModulesDictionary[id];
                else {
                    console.warn("Stats module with id: '", id, "' not found!");
                    return null;
                }
            };
            this._engine = engine;
            this._attachContainer = container;
            this.width = engine.stage.width;
            this.height = engine.stage.height;
            this._renderScale = this._engine.renderer.resolution;
            this.buildUI();
        }
        get isVisible() { return this._isHidden; }
        get pauseButton() { return this._pauseButton; }
        ;
    }
    adservio.AdservioUIOverlay = AdservioUIOverlay;
    class StatsModule extends sb.pixi.display.Container {
        constructor(statsConfig, bgTexture) {
            super(statsConfig.width, statsConfig.height);
            this._textfieldHorizontalMargin = 8;
            this.print = (text) => {
                this._dynamicValueTextfield.text = String(text);
            };
            this._descriptionString = statsConfig.description;
            let textureScale = bgTexture.baseTexture.resolution;
            this._bgFill = new PIXI.mesh.NineSlicePlane(bgTexture, 12 / textureScale, 12 / textureScale, 12 / textureScale, 12 / textureScale);
            this._bgFill.width = this.width;
            this._bgFill.height = this.height;
            this._bgFill.alpha = 0.6;
            this.addChild(this._bgFill);
            //create text style
            this._descriptionTextStyle = new PIXI.TextStyle({
                fontFamily: 'Segoe UI',
                fontSize: 14,
                fill: statsConfig.textColor,
                fontWeight: statsConfig.fontWeight
            });
            this._descriptionTextfield = new PIXI.Text(this._descriptionString, this._descriptionTextStyle);
            this._descriptionTextfield.y = (this.height - this._descriptionTextfield.height) / 2;
            this._descriptionTextfield.x = this._textfieldHorizontalMargin;
            this.addChild(this._descriptionTextfield);
            //create text style
            this._dynamicValueTextStyle = new PIXI.TextStyle({
                fontFamily: 'Segoe UI',
                fontSize: 14,
                fill: statsConfig.textColor,
                fontWeight: "normal"
            });
            this._dynamicValueTextfield = new PIXI.Text("", this._dynamicValueTextStyle);
            this._dynamicValueTextfield.y = (this.height - this._dynamicValueTextfield.height) / 2;
            this._dynamicValueTextfield.x = this.width - this._textfieldHorizontalMargin;
            this._dynamicValueTextfield.anchor.x = 1;
            this.addChild(this._dynamicValueTextfield);
        }
    }
    adservio.StatsModule = StatsModule;
})(adservio || (adservio = {}));
//# sourceMappingURL=AdservioUIOverlay.js.map