namespace adservio
{
    export class DefaultGameResultsScreen extends adservio.Screen
    {       

        //buttons
        private _continueButton: SimpleButton;
        private _retryButton: SimpleButton;
        private _currentButton: SimpleButton;

        //view components
        private _screenTitleView: ScreenTitleView;
        private _gameTitleView: GameTitleView;
        private _statsView: StatsView;

        constructor()
        {
            super();

            this.onInitialized.add(this.init_handler);
            this.onActivated.add(this.screenActivated_handler);
        }

        private init_handler = (data: IGameResultsData) =>
        {
            //build screen title view
            this._screenTitleView = new ScreenTitleView(this.engine.assets);
            this._screenTitleView.y = this.height * 0.02;
            this._screenTitleView.x = -15;
            this._screenTitleView.render("Results");
            this.addChild(this._screenTitleView);

            //game view
            this._gameTitleView = new GameTitleView(this.engine.assets, 18);
            this._gameTitleView.y = this.height * 0.25;
            this.addChild(this._gameTitleView);

            //stats view
            this._statsView = new StatsView(300, 200, this.engine.assets);
            this._statsView.x = (this.width - this._statsView.width) / 2;
            this._statsView.y = this.height * 0.35;
            this.addChild(this._statsView);

            //continue button
            this._continueButton = new SimpleButton(this.engine.assets.getTexture("slice9_button_bg2"), { left: 20, right: 20, top: 21, bottom: 21 }, 45, 20);
            this._continueButton.setLabel("Continue");
            this._continueButton.setIconTexture(this.engine.assets.getTexture("arrow_icon_white_sm"));
            this._continueButton.setIconSize(18);
            this._continueButton.x = (this.width - this._continueButton.width) / 2;
            this._continueButton.y = this.height * 0.7;
            this._continueButton.on("pointerover", () =>
            {
                this._continueButton.alpha = 0.8;
            })
            this._continueButton.on("pointerout", () =>
            {
                this._continueButton.alpha = 1;
            })

            this._currentButton = this._continueButton;

            this.addChild(this._currentButton)
            /*
            this._retryButton = new SimpleButton(this.engine.assets.getTexture("slice9_button_bg2"), { left: 20, right: 20, top: 21, bottom: 21 }, 45, 20);
            this._retryButton.setLabel("Retry");
            this._retryButton.setIconTexture(this.engine.assets.getTexture("retry_icon_white_sm"));
            this._retryButton.setIconSize(18);
            this._retryButton.x = (this.width - this._retryButton.width) / 2;
            this._retryButton.y = this.height * 0.7;
            */

            //button handlers
            //this._continueButton.on("pointerdown", this.continueButton_handler);
            //this._retryButton.on("pointerdown", this.retryButton_handler);

        }

        private continueButton_handler = () =>
        {
            this.engine.switchToScreen("GAME_SCREEN")
        }

        private retryButton_handler = () =>
        {
            this.engine.switchToScreen("GAME_SCREEN")
        }

        private readjustSize = () =>
        {
            this._gameTitleView.x = (this.width - this._gameTitleView.width) / 2;

        }

        private screenActivated_handler = (data: IGameResultsData) =>
        { 
            //update text values

            this._gameTitleView.render(data.gameTitle);

            this._statsView.levelRow.printValue(String(data.level));
            this._statsView.lastScoreRow.printValue(String(data.lastScore));
            this._statsView.highestScoreRow.printValue(String(data.highScore));

            /*
            //display button
            if (this._currentButton)
            {
                this._currentButton.parent.removeChild(this._currentButton);
                this._currentButton = null;
            }
            */

            if (data.levelPassed)
            {
                this._currentButton.once("pointerdown", this.continueButton_handler);
            }
            else
            {
                this._currentButton.once("pointerdown", this.retryButton_handler);
            }


            this.addChild(this._currentButton)

            this.readjustSize();
        }

        public animateIn(callback?: Function) 
        {
            this.alpha = 0;
            this.y = this.height * 0.7;

            var rowsYOffset: number = 130;
            var gameTitleTargetY: number = this._gameTitleView.y;
            var statsViewTargetY: number = this._statsView.y;
            var currentButtonTargetY: number = this._currentButton.y;

            //prepare views
            this._statsView.alpha = 0;
            this._statsView.y += rowsYOffset;

            this._gameTitleView.alpha = 0;
            this._gameTitleView.y += rowsYOffset;         

            this._currentButton.alpha = 0;
            this._currentButton.y += rowsYOffset;

            TweenMax.to(this._gameTitleView, 0.6, { delay: 0.7, y: gameTitleTargetY, alpha: 1, ease: Expo.easeOut })
            TweenMax.to(this._statsView, 0.6, { delay: 0.8, y: statsViewTargetY, alpha: 1, ease: Expo.easeOut })
            TweenMax.to(this._currentButton, 0.6, { delay: 0.9, y: currentButtonTargetY, alpha: 1, ease: Expo.easeOut })


            TweenMax.to(this, 1, {
                delay: 0.3,
                alpha: 1, y: 0, ease: Expo.easeInOut, onComplete: () =>
                {
                    if (callback)
                        callback();
                }
            })
        }

        public animateOut(callback?: Function)
        {
            TweenMax.to(this, 1, { delay: 0, alpha: 0, y: this.height * 0.8, ease: Expo.easeInOut, onComplete: callback })
        }

    }

    class ScreenTitleView extends sb.pixi.display.Container
    {
        private _screenTitleTextfield: PIXI.Text;
        private _bg: PIXI.mesh.NineSlicePlane;
        private _paddingLeft: number = 30;
        private _paddingRight: number = 20;

        constructor(assets: sb.pixi.AssetsManager)
        {
            super(0, 40);

            this._bg = new PIXI.mesh.NineSlicePlane(assets.getTexture("slice9_bg2"), 12, 12, 12, 12);
            this._bg.height = this.height;
            this._bg.width = this.width;
            this.addChild(this._bg);

            this._screenTitleTextfield = new PIXI.Text("");
            this._screenTitleTextfield.style.fontFamily = "Segoe UI";
            this._screenTitleTextfield.style.fontSize = 20;
            this._screenTitleTextfield.style.fill = 0xFFFFFF;
            this._screenTitleTextfield.x = this._paddingLeft;
            this._screenTitleTextfield.y = Math.round((this.height - this._screenTitleTextfield.height) / 2);
            this._screenTitleTextfield.alpha = 0.8;
            this.addChild(this._screenTitleTextfield);
        }

        private readjustSize = () =>
        {
            this.width = this._paddingLeft + this._paddingRight + this._screenTitleTextfield.width;
            this._bg.width = this.width;
        }

        public render = (text: string) =>
        {
            this._screenTitleTextfield.text = text;
            this.readjustSize();
        }
    }

    class GameTitleView extends sb.pixi.display.Container
    {
        private _label: PIXI.Text;
        private _bg: PIXI.mesh.NineSlicePlane;
        private _paddingLeft: number = 15;
        private _paddingRight: number = 15;
        private _paddingTop: number = 5;
        private _paddingBottom: number = 5;
        private _fontSize: number;

        constructor(assets: sb.pixi.AssetsManager, fontSize: number = 24)
        {
            super(0, 0);
            this._fontSize = fontSize;

            this._bg = new PIXI.mesh.NineSlicePlane(assets.getTexture("slice9_bg2"), 12, 12, 12, 12);
            this._bg.height = this.height;
            this._bg.width = this.width;
            this._bg.alpha = 0.5;
            this.addChild(this._bg);

            this._label = new PIXI.Text("");
            this._label.style.fontFamily = "Segoe UI";
            this._label.style.fontSize = this._fontSize;
            this._label.style.fill = 0xFFFFFF;
            this._label.x = this._paddingLeft;
            this._label.y = this._paddingTop;
            this._label.alpha = 0.9;
            this.addChild(this._label);
        }

        private readjustSize = () =>
        {
            this.width = this._paddingLeft + this._paddingRight + this._label.width;
            this.height = this._paddingTop + this._paddingBottom + this._label.height;
            this._bg.width = this.width;
            this._bg.height = this.height;
        }

        public render = (text: string) =>
        {
            this._label.text = text;
            this.readjustSize();
        }
    }

    class StatsView extends sb.pixi.display.Container
    {
        private _bg: PIXI.mesh.NineSlicePlane;
        public lastScoreRow: ResultRow;
        public highestScoreRow: ResultRow;
        public levelRow: ResultRow;

        constructor(width: number, height: number, assets: sb.pixi.AssetsManager)
        {
            super(width, height);

            this._bg = new PIXI.mesh.NineSlicePlane(assets.getTexture("slice9_bg2"), 12, 12, 12, 12);
            this._bg.height = this.height;
            this._bg.width = this.width;
            this._bg.alpha = 0.3;
            this.addChild(this._bg);

            this.lastScoreRow = new ResultRow(this.width, 50, "Last score:", "0",25);
            this.lastScoreRow.y = this.height * 0.2;
            this.addChild(this.lastScoreRow);

            this.highestScoreRow = new ResultRow(this.width, 50, "Highest score:", "0", 25);
            this.highestScoreRow.y = this.height * 0.4;
             this.addChild(this.highestScoreRow);

            //last level row
            this.levelRow = new ResultRow(this.width, 50, "Level:", "0", 25);
            this.levelRow.y = this.height * 0.6;
            this.addChild(this.levelRow);
        }
    }



    class ResultRow extends sb.pixi.display.Container
    {
        private _labelTextfield: PIXI.Text;
        private _valueTextfield: PIXI.Text;

        private _margin: number;


        constructor(rowWidth: number, rowHeight: number, label: string, initialValue: string, margin: number = 10)
        {
            super(rowWidth, rowHeight);
            this._margin = margin;

            this._labelTextfield = new PIXI.Text(label);
            this._labelTextfield.style.fontFamily = "Segoe UI";
            this._labelTextfield.style.fontSize = 20;
            this._labelTextfield.style.fill = 0xFFFFFF;
            this._labelTextfield.y = Math.round((this.height - this._labelTextfield.height) / 2);
            this._labelTextfield.x = this._margin;
            this._labelTextfield.alpha = 0.7;
            this.addChild(this._labelTextfield);

            this._valueTextfield = new PIXI.Text(initialValue);
            this._valueTextfield.style.fontFamily = "Segoe UI";
            this._valueTextfield.style.fontSize = 20;
            this._valueTextfield.style.fill = 0xFFFFFF;
            this._valueTextfield.y = Math.round((this.height - this._valueTextfield.height) / 2);
            this._valueTextfield.x = this.width - this._valueTextfield.width - this._margin;
            this._valueTextfield.alpha = 0.8;
            this.addChild(this._valueTextfield);
        }

        public printValue = (value: string) =>
        {
            this._valueTextfield.text = value;
            this._valueTextfield.x = this.width - this._valueTextfield.width - this._margin;
        }
    }



    class SimpleButton extends sb.pixi.display.Container
    {
        private _bg: PIXI.mesh.NineSlicePlane;
        private _labelText: PIXI.Text;
        private _iconSprite: PIXI.Sprite;
        private _padding: number;

        constructor(slice9Texture: PIXI.Texture, slice9Grid: { left: number, right: number, top: number, bottom: number }, height: number = 50, padding: number = 5, fontSize: number = 18)
        {
            super()
            this.height = height;
            this.interactive = true;
            this.buttonMode = true;

            this._padding = padding;

            this._bg = new PIXI.mesh.NineSlicePlane(slice9Texture, slice9Grid.left, slice9Grid.right, slice9Grid.top, slice9Grid.bottom);
            this._bg.height = height;
            this.addChild(this._bg);

            this._iconSprite = new PIXI.Sprite();

            this.addChild(this._iconSprite);

            this._labelText = new PIXI.Text("");
            this._labelText.style.fontFamily = "Segoe UI";
            this._labelText.style.fontSize = fontSize;
            this._labelText.style.fill = 0xFFFFFF;
            this._labelText.style.align = "center";
            //this._labelText.style.fontWeight = "bold";

            this._labelText.x = this._padding;
            this._labelText.y = Math.round((this.height - this._labelText.height) / 2);
            this.addChild(this._labelText);

            this.updateSize();
        }

        private updateSize = () =>
        {
            this.width = this._iconSprite.width + this._labelText.width + 3 * this._padding;
            this._bg.width = this.width;

            this._iconSprite.x = this._labelText.x + this._labelText.width + this._padding;
        }

        public setLabel = (value: string) =>
        {
            this._labelText.text = value;
            this.updateSize();
        }

        public setIconTexture = (texture: PIXI.Texture) =>
        {
            this._iconSprite.texture = texture;
        }

        public setIconSize = (size: number) =>
        {
            this._iconSprite.width = this._iconSprite.height = size;
            this._iconSprite.y = (this.height - this._iconSprite.height) / 2;

            this.updateSize();
        }
    }

}

