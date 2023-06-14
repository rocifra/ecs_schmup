var adservio;
(function (adservio) {
    class GameScreenBase extends adservio.Screen {
        constructor() {
            super();
            this.onGameStarted = new sb.signals.Signal0();
            this.onGamePaused = new sb.signals.Signal0();
            this.onGameResumed = new sb.signals.Signal0();
            this.onGameReset = new sb.signals.Signal0();
            this.onAnimateInStarted = new sb.signals.Signal0();
            this.onAnimateInCompleted = new sb.signals.Signal0();
            this.onAnimateOutStarted = new sb.signals.Signal0();
            this.onAnimateOutCompleted = new sb.signals.Signal0();
            this.countDownSeconds = 0;
            this._isStarted = false;
            this._displayCountDownModal = true;
            this.initialized_handler = () => {
                //pause the timeline
                this.timeline.timeScale = 0;
                this._modalCountDownTimerScreen = new adservio.ModalTimerScreen(this.engine, this.width, this.height, this, 50);
                this._modalCountDownTimerScreen.onTickEvent.add(() => { this.engine.soundManager.play('chime'); });
                this._modalCountDownTimerScreen.onCountDownEnded.add(this.countDownEnded_handler);
            };
            this.gameScreenActivated = (gameState) => {
                //pause timeline
                this.pauseTimeline();
                if (gameState == adservio.GameStates.RESET) {
                    this.onGameReset.dispatch();
                    this._displayCountDownModal = true;
                }
                if (this._isStarted) {
                    //resume
                    this.onGameResumed.dispatch();
                }
                else {
                    //first start
                    this._isStarted = true;
                    this.onGameStarted.dispatch();
                }
                this.timeline.add(this.update);
            };
            this.countDownEnded_handler = () => {
                //resume timeline
                this.resumeTimeline(1);
                this._displayCountDownModal = false;
            };
            this.gameScreenDeactivated = () => {
                if (this._modalCountDownTimerScreen.isCounting) {
                    this._modalCountDownTimerScreen.cancelCountDown();
                }
                if (this._isStarted)
                    this.onGamePaused.dispatch();
                this.timeline.remove(this.update);
            };
            this.pauseTimeline = (pauseTweenTimeSE = 0) => {
                TweenMax.to(this.timeline, pauseTweenTimeSE, { timeScale: 0 });
            };
            this.resumeTimeline = (resumeTweenTime = 0) => {
                TweenMax.to(this.timeline, resumeTweenTime, { timeScale: 1 });
            };
            //overiddables
            this.update = (deltaMS, deltaSC) => {
            };
            this.onInitialized.addOnce(this.initialized_handler);
            this.onActivated.add(this.gameScreenActivated);
            this.onDeactivated.add(this.gameScreenDeactivated);
        }
        endGame() {
            Logger.log("Game End");
            this._isStarted = false;
            this.pauseTimeline(0.5);
        }
        //overrides
        animateIn(callback) {
            this.onAnimateInStarted.dispatch();
            //show ui overlay
            this.engine.uiOverlay.show(0.5);
            this.alpha = 0;
            this.y = -this.height * 0.7;
            TweenMax.to(this, 1.2, {
                alpha: 1, y: 0, ease: Expo.easeInOut, onComplete: () => {
                    //f ((this.countDownTimerEnabled) && (!this._isGameEnd))
                    if ((this.countDownSeconds > 0) && (this._displayCountDownModal)) {
                        this._modalCountDownTimerScreen.startCountDown(this.countDownSeconds);
                    }
                    else {
                        this.resumeTimeline(0.5);
                    }
                    if (callback)
                        callback();
                    this.onAnimateInCompleted.dispatch();
                }
            });
        }
        animateOut(callback) {
            this.onAnimateOutStarted.dispatch();
            //hide ui overlay
            this.engine.uiOverlay.hide();
            //pause the timeline
            this.pauseTimeline(0.5);
            TweenMax.to(this, 1, { delay: 0.2, alpha: 0, y: -this.height * 0.8, ease: Expo.easeInOut, onComplete: callback });
        }
        //getters & setters
        get isStarted() { return this._isStarted; }
    }
    adservio.GameScreenBase = GameScreenBase;
})(adservio || (adservio = {}));
//# sourceMappingURL=GameScreenBase.js.map