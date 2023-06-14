namespace adservio
{

    export class GameScreenBase extends adservio.Screen
    {

        public onGameStarted: sb.signals.Signal0 = new sb.signals.Signal0();
        public onGamePaused: sb.signals.Signal0 = new sb.signals.Signal0();
        public onGameResumed: sb.signals.Signal0 = new sb.signals.Signal0();
        public onGameReset: sb.signals.Signal0 = new sb.signals.Signal0();

        public onAnimateInStarted: sb.signals.Signal0 = new sb.signals.Signal0();
        public onAnimateInCompleted: sb.signals.Signal0 = new sb.signals.Signal0();
        public onAnimateOutStarted: sb.signals.Signal0 = new sb.signals.Signal0();
        public onAnimateOutCompleted: sb.signals.Signal0 = new sb.signals.Signal0();
        public countDownSeconds: number = 0;

        private _modalCountDownTimerScreen: adservio.ModalTimerScreen;
        private _isStarted: boolean = false;
        private _displayCountDownModal: boolean = true;

        constructor()
        {
            super();


            this.onInitialized.addOnce(this.initialized_handler);
            this.onActivated.add(this.gameScreenActivated);
            this.onDeactivated.add(this.gameScreenDeactivated);
        }

        private initialized_handler = () =>
        {
            //pause the timeline
            this.timeline.timeScale = 0;

            this._modalCountDownTimerScreen = new adservio.ModalTimerScreen(this.engine, this.width, this.height, this, 50);

            this._modalCountDownTimerScreen.onTickEvent.add(() => { this.engine.soundManager.play('chime'); });
            this._modalCountDownTimerScreen.onCountDownEnded.add(this.countDownEnded_handler)
        }

        private gameScreenActivated = (gameState: number) =>
        {
            //pause timeline
            this.pauseTimeline();

            if (gameState == adservio.GameStates.RESET)
            {
                this.onGameReset.dispatch();
                this._displayCountDownModal = true;
            }

            if (this._isStarted)
            {
                //resume
                this.onGameResumed.dispatch();
            }
            else
            {
                //first start
                this._isStarted = true;
                this.onGameStarted.dispatch();
            }

            this.timeline.add(this.update);
        }

        private countDownEnded_handler = () =>
        {
            //resume timeline
            this.resumeTimeline(1);
            this._displayCountDownModal = false;
        }

        private gameScreenDeactivated = () =>
        {
            if (this._modalCountDownTimerScreen.isCounting)
            {
                this._modalCountDownTimerScreen.cancelCountDown();
            }

            if (this._isStarted)
                this.onGamePaused.dispatch();

            this.timeline.remove(this.update);
        }

        public pauseTimeline = (pauseTweenTimeSE: number = 0) =>
        {
            TweenMax.to(this.timeline, pauseTweenTimeSE, { timeScale: 0 })
        }

        public resumeTimeline = (resumeTweenTime: number = 0) =>
        {
            TweenMax.to(this.timeline, resumeTweenTime, { timeScale: 1 })
        }

        //overiddables
        protected update = (deltaMS: number, deltaSC: number) =>
        {

        }

        protected endGame()
        {
            Logger.log("Game End");
            this._isStarted = false;

            this.pauseTimeline(0.5);
        }

        //overrides
        public animateIn(callback?: Function) 
        {
            this.onAnimateInStarted.dispatch();

            //show ui overlay
            this.engine.uiOverlay.show(0.5);

            this.alpha = 0;
            this.y = -this.height * 0.7;
            TweenMax.to(this, 1.2, {
                alpha: 1, y: 0, ease: Expo.easeInOut, onComplete: () =>
                {                  

                    //f ((this.countDownTimerEnabled) && (!this._isGameEnd))
                    if ((this.countDownSeconds > 0) && (this._displayCountDownModal))
                    {
                        this._modalCountDownTimerScreen.startCountDown(this.countDownSeconds);
                    }
                    else
                    {
                        this.resumeTimeline(0.5);
                    }

                    if (callback)
                        callback();

                    this.onAnimateInCompleted.dispatch();
                }
            })
        }

        public animateOut(callback?: Function)
        {
            this.onAnimateOutStarted.dispatch();

            //hide ui overlay
            this.engine.uiOverlay.hide();

            //pause the timeline
            this.pauseTimeline(0.5);

            TweenMax.to(this, 1, { delay: 0.2, alpha: 0, y: -this.height * 0.8, ease: Expo.easeInOut, onComplete: callback })
        }

        //getters & setters
        public get isStarted(): boolean { return this._isStarted }

    }
}