/// <reference path="../../sb/pixi/display/Container.ts" />
var adservio;
/// <reference path="../../sb/pixi/display/Container.ts" />
(function (adservio) {
    class ModalTimerScreen extends sb.pixi.display.Container {
        constructor(engine, width, height, parentContainer, timerBGSize = 100) {
            super(width, height);
            this.onCountDownEnded = new sb.signals.Signal0();
            this.onTickEvent = new sb.signals.Signal0();
            this._isCounting = false;
            this.fadeOut = () => {
                //display out animation
                TweenMax.to(this._clockBG, 0.2, { alpha: 0 });
                //TweenMax.to(this._clockBG.scale, 0.5, { x: 0, y: 0, ease: Expo.easeIn })
                //TweenMax.to(this._counterText.scale, 0.5, { x: 0.2, y: 0.2, ease: Expo.easeOut })
                TweenMax.to(this._counterText, 0.2, { alpha: 0 });
                TweenMax.to(this._backgroundQuad, 0.2, {
                    alpha: 0, onComplete: () => {
                        this.parent.removeChild(this);
                    }
                });
                this.onCountDownEnded.dispatch();
            };
            this.animateCounter = (callback) => {
                var animationSpeed = 0.3;
                TweenMax.to(this._clockBG.scale, animationSpeed, {
                    x: 1.2, y: 1.2, ease: Expo.easeIn, onComplete: () => {
                        this._counterText.text = String(this._timer.tickCount - this._timer.currentTickCount);
                        if (this._isCounting)
                            this.onTickEvent.dispatch();
                        TweenMax.to(this._clockBG.scale, animationSpeed, { x: 1, y: 1, ease: Expo.easeOut, onComplete: callback });
                    }
                });
            };
            this.onTickHandler = () => {
                if (this._timer.tickCount > this._timer.currentTickCount)
                    this.animateCounter();
                else
                    this.fadeOut();
            };
            this.stop = () => {
                this._timer.stop();
            };
            this.reset = () => {
                this._isCounting = false;
                this._timer.stop();
                this._parentContainer.removeChild(this);
            };
            this.cancelCountDown = () => {
                this.reset();
            };
            this.startCountDown = (tickCount, tickFrequency = 1000) => {
                this._isCounting = true;
                this._timer.tickFrequency = tickFrequency;
                this._timer.tickCount = tickCount;
                //prepare for display animation
                this._backgroundQuad.alpha = 0;
                this._clockBG.alpha = 0;
                //this._clockBG.scale.set(0.5);
                this._counterText.text = "";
                this._counterText.alpha = 1;
                this._counterText.scale.set(1, 1);
                this._parentContainer.addChild(this);
                //fadeIn
                TweenMax.to(this._backgroundQuad, 0.5, {
                    alpha: 1, onComplete: () => {
                        this.animateCounter();
                        this._timer.start();
                    }
                });
                TweenMax.to(this._clockBG, 0.6, { alpha: 1, delay: 0.5 });
            };
            this._timerBGSize = timerBGSize;
            this._engine = engine;
            //setup timer
            this._timer = new sb.time.TimelineTimer(engine.mainClock.timeline);
            this._timer.tickFrequency = 1000;
            this._timer.tickCount = 3;
            this._timer.onTick.add(this.onTickHandler);
            //this._timer.onEnd.add(this.onTimerEndHandler);
            this._parentContainer = parentContainer;
            this._backgroundQuad = new PIXI.Graphics();
            this._backgroundQuad.beginFill(0x000000, 0.5);
            this._backgroundQuad.drawRect(0, 0, width, height);
            this._backgroundQuad.endFill();
            this._backgroundQuad.interactive = true;
            this.addChild(this._backgroundQuad);
            this._clockBG = new PIXI.Sprite(this._engine.assets.getTexture('modal_timer_clock_bg'));
            //this._clockBG.width = this._clockBG.height = timerBGSize;
            this._clockBG.pivot.x = this._clockBG.texture.width / 2;
            this._clockBG.pivot.y = this._clockBG.texture.height / 2;
            this._clockBG.x = this.width / 2;
            this._clockBG.y = this.height / 2;
            this.addChild(this._clockBG);
            this._counterText = new PIXI.Text();
            this._counterText.style.fontFamily = "Segoe UI";
            this._counterText.style.fontSize = 64;
            this._counterText.style.fontWeight = "bold";
            this._counterText.style.fill = 0x193345;
            this._counterText.anchor.set(0.5);
            this._counterText.position.set(this.width / 2, this.height / 2);
            this.addChild(this._counterText);
        }
        get isCounting() {
            return this._isCounting;
        }
    }
    adservio.ModalTimerScreen = ModalTimerScreen;
})(adservio || (adservio = {}));
//# sourceMappingURL=ModalTimerScreen.js.map