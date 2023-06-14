namespace adservio
{
    export class AdservioUIOverlay extends sb.pixi.display.Container
    {

        private _isHidden: boolean = false;
        private _engine: adservio.Engine;
        private _attachContainer: sb.pixi.display.Container;

        //display components
        private _menuContainer: sb.pixi.display.Container;

        private _modularStatsContainer: sb.pixi.display.Container;
        private _statsModulesDictionary: { [label: string]: StatsModule } = {};
        private _statsModules: Array<StatsModule> = new Array();
        private _statsModuleHorizontalPadding: number = 5;
        private _statsModuleHeight: number = 34;

        private _pauseButton: PIXI.Sprite;
        private _renderScale: number = 1;

        constructor(engine: adservio.Engine, container: sb.pixi.display.Container)
        {
            super();

            this._engine = engine;
            this._attachContainer = container;

            this.width = engine.stage.width;
            this.height = engine.stage.height;

            this._renderScale = this._engine.renderer.resolution;

            this.buildUI();
        }

        private buildUI = () =>
        {
            //menu container
            this._menuContainer = new sb.pixi.display.Container(this.width, 60);
            this.addChild(this._menuContainer);

            //modular stats container
            this._modularStatsContainer = new sb.pixi.display.Container(2, 60);
            //this._modularStatsContainer.showBounds(0xCCC000);
            this._modularStatsContainer.x = 10;//this.width - 60;
            this._menuContainer.addChild(this._modularStatsContainer);

            this._pauseButton = new PIXI.Sprite(this._engine.assets.getTexture("pause_icon"));
            this._pauseButton.width = this._pauseButton.height = 50;
            this._pauseButton.y = (this._menuContainer.height - this._pauseButton.height) / 2;
            this._pauseButton.x = this._menuContainer.width - this._pauseButton.width - 10;
            this._pauseButton.interactive = true;
            this._pauseButton.buttonMode = true;
            this._pauseButton.on('pointerdown', this.pauseButtonPointerDown_handler)
            this._menuContainer.addChild(this._pauseButton)

            //build stats modules
            var statsModulesArray: Array<IStatsModuleConfig> = this._engine.engineConfig.uiOverlay.statsModules;

            for (let i = 0; i < statsModulesArray.length; i++)
            {
                this.buildStatsContainer(statsModulesArray[i]);
            }

        }

        private pauseButtonPointerDown_handler = () =>
        {

            this._engine.switchToScreen(this._engine.engineConfig.uiOverlay.menuScreenID, null, adservio.GameStates.PAUSE);

        }

        public buildStatsContainer = (moduleConfig: IStatsModuleConfig) =>
        {
            var statsModule: StatsModule = new StatsModule(moduleConfig, this._engine.assets.getTexture("9slice_stats_module_bg", this._renderScale));

            var lastAddedStatsModule: StatsModule;
            var targetX: number = 0;

            //get last added statsModule
            if (this._statsModules.length > 0)
            {
                lastAddedStatsModule = this._statsModules[this._statsModules.length - 1];
                targetX = lastAddedStatsModule.x + lastAddedStatsModule.width;
            }
            else
            {
                targetX = 0//- statsModule.width;
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

        }

        public show = (delay: number = 0, callback?: Function) =>
        {
            if (!this._isHidden)
            {
                //enable button
                this._pauseButton.interactive = true;

                //prep animation
                this._menuContainer.y = -this._menuContainer.height;
                this._menuContainer.alpha = 0;

                this._attachContainer.addChild(this);
                this._isHidden = true;

                TweenMax.to(this._menuContainer, 1, { alpha: 1, y: 0, delay: delay, ease: Expo.easeInOut, onComplete: callback })
            }
        }

        public hide = (delay: number = 0, callback?: Function) =>
        {
            if (this._isHidden)
            {
                this._isHidden = false;

                //disable button
                this._pauseButton.interactive = false;

                TweenMax.to(this._menuContainer, 0.5, {
                    alpha: 0, y: -this._menuContainer.height, delay: delay, ease: Expo.easeInOut, onComplete: () =>
                    {
                        this.parent.removeChild(this);

                        if (callback)
                            callback();
                    }
                })
            }
        }

        public getStatsModuleReference = (id: string): StatsModule =>
        {
            if (this._statsModulesDictionary.hasOwnProperty(id))
                return this._statsModulesDictionary[id];
            else
            {
                console.warn("Stats module with id: '", id, "' not found!");
                return null
            }
        }

        public get isVisible(): boolean { return this._isHidden }
        public get pauseButton(): PIXI.Sprite { return this._pauseButton };

    }

    export class StatsModule extends sb.pixi.display.Container
    {

        private _bgFill: PIXI.mesh.NineSlicePlane;

        //textfields
        private _descriptionTextfield: PIXI.Text;
        private _descriptionString: string;
        private _descriptionTextStyle: PIXI.TextStyle;

        private _dynamicValueTextfield: PIXI.Text;
        private _dynamicValueTextStyle: PIXI.TextStyle;

        private _textfieldHorizontalMargin: number = 8;

        constructor(statsConfig: IStatsModuleConfig, bgTexture: PIXI.Texture)
        {
            super(statsConfig.width, statsConfig.height);

            this._descriptionString = statsConfig.description;

            let textureScale: number = bgTexture.baseTexture.resolution;

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
            })

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
            })

            this._dynamicValueTextfield = new PIXI.Text("", this._dynamicValueTextStyle);
            this._dynamicValueTextfield.y = (this.height - this._dynamicValueTextfield.height) / 2;
            this._dynamicValueTextfield.x = this.width - this._textfieldHorizontalMargin;
            this._dynamicValueTextfield.anchor.x = 1
            this.addChild(this._dynamicValueTextfield);
        }

        public print = (text: string | number) =>
        {
            this._dynamicValueTextfield.text = String(text);
        }

    }
}