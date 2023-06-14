namespace adservio
{
    export class DefaultMenuScreen extends adservio.Screen
    {

        private _startGameButton: adservio.MenuScreenButton;
        private _restartGameButton: adservio.MenuScreenButton;
        private _helpButton: adservio.MenuScreenButton;
        private _soundControlButton: adservio.MenuScreenButton;

        private _menuButtonHeight: number = 40;

        constructor()
        {
            super();
            this.onInitialized.addOnce(this.init);
            this.onActivated.add(this.screenActivated_handler);
        }

        public init = () =>
        {

            this._startGameButton = new adservio.MenuScreenButton(this.engine.assets.getTexture("play_icon"), "Start game", this.width, this._menuButtonHeight,60,0.5);
            this._startGameButton.y = 0.38 * this.height;
            this._restartGameButton = new adservio.MenuScreenButton(this.engine.assets.getTexture("restart_icon"), "Restart game", this.width, this._menuButtonHeight);
            this._restartGameButton.y = 0.5 * this.height;
            this._restartGameButton.alpha = 0.5;
            this._restartGameButton.interactive = false;

            /*
            this._helpButton = new adservio.MenuScreenButton(this.engine.assets.getTexture("help_icon"), "Help", this.width, this._menuButtonHeight);
            this._helpButton.alpha = 0.5;
            this._helpButton.y = 0.52 * this.height;
            */

            this._soundControlButton = new adservio.MenuScreenButton(this.engine.assets.getTexture("sound_icon_on"), "Sound", this.width, this._menuButtonHeight, 50);
            this._soundControlButton.y = 0.62 * this.height;

            this.addChild(this._startGameButton);
            this.addChild(this._restartGameButton);
            //this.addChild(this._helpButton);
            this.addChild(this._soundControlButton);

            //interaction handlers
            this._startGameButton.on('pointerdown', this.startGameButton_handler);
            this._restartGameButton.on('pointerdown', this.restartGame_handler);
            this._soundControlButton.on('pointerdown', this.toggleGameSound_handler);

            //update sound control button
            this.muteOptionChange_handler();

            //signal listeners
            this.engine.soundManager.onMuteOptionChanged.add(this.muteOptionChange_handler);
                        
            //this.engine.gameState.onGamePaused.add(this.gamePaused_handler);
            //this.engine.gameState.onGamePaused.add(this.gamePaused_handler);
            
        }
        
        private muteOptionChange_handler = () =>
        {
            if (!this.engine.soundManager.muted)
            {
                //change icon
                this._soundControlButton.iconTexture = this.engine.assets.getTexture("sound_icon_on")
            }
            else
            {
                //change icon
                this._soundControlButton.iconTexture = this.engine.assets.getTexture("sound_icon_off")
            }
        }
        

        public screenActivated_handler = (gameState: number) =>
        {
            //this._startGameButton.interactive = true;

            if (gameState == adservio.GameStates.PAUSE) {
                this._startGameButton.label = "Resume game";
                //enable reset
                this._restartGameButton.interactive = true;
                this._restartGameButton.alpha = 1;
            }
        }

        public toggleGameSound_handler = (gameState: string) =>
        {
            if (this.engine.soundManager.muted)
            {
                //unmute
                this.engine.soundManager.muted = false;                
            }
            else
            {
                //mute
                this.engine.soundManager.muted = true;                
            }
        }

        private disableButtons = () =>
        {
            this._startGameButton.interactive = false;
            this._restartGameButton.interactive = false;
        }


        private startGameButton_handler = () =>
        {
            //this.disableButtons();
            this.engine.switchToScreen("GAME_SCREEN");
        }

        private restartGame_handler = () =>
        {
            //this.disableButtons();
            this.engine.switchToScreen("GAME_SCREEN", null, adservio.GameStates.RESET);
        }

        public animateIn(callback?: Function)
        {
            var delay: number = 0.2;
            //prepare animation
            this.alpha = 0;
            this.y = this.height / 2;

            this._startGameButton.animateIn(delay+0.3);
            this._restartGameButton.animateIn(delay +0.4);
            //this._helpButton.animateIn(delay +0.5);
            this._soundControlButton.animateIn(delay +0.5);

            TweenMax.to(this, 1, { delay: delay, alpha: 1, y: 0, ease: Expo.easeInOut, onComplete: callback })
        }

        public animateOut(callback?: Function)
        {
            this._soundControlButton.animateOut(0);
            //this._helpButton.animateOut(0.1);
            this._restartGameButton.animateOut(0.1);
            this._startGameButton.animateOut(0.2);

            TweenMax.to(this, 1.2, { alpha: 0, y: this.height / 2, ease: Expo.easeInOut, onComplete: callback })
        }


    }

}