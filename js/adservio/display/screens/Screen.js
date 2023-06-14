var adservio;
(function (adservio) {
    class Screen extends sb.pixi.display.Container {
        constructor() {
            super();
            this.onInitialized = new sb.signals.Signal0(); //once when assets loaded
            this.onActivated = new sb.signals.Signal1();
            this.onDeactivated = new sb.signals.Signal1();
            this.timeline = new sb.time.ClockTimeline();
            this._initialized = false;
        }
        initialize(engine) {
            this._engine = engine;
            this.width = this._engine.stage.width;
            this.height = this._engine.stage.height;
            this._initialized = true;
            this.onInitialized.dispatch();
        }
        get engine() {
            if (this._initialized)
                return this._engine;
            else
                Logger.warn("Screen not initialized!");
        }
        get initialized() {
            return this._initialized;
        }
        animateIn(callback) {
            this.alpha = 0;
            TweenMax.to(this, 1, { alpha: 1, onComplete: callback });
        }
        animateOut(callback) {
            TweenMax.to(this, 1, { alpha: 0, onComplete: callback });
        }
    }
    adservio.Screen = Screen;
})(adservio || (adservio = {}));
//# sourceMappingURL=Screen.js.map