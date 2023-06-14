namespace adservio
{

    export class Screen extends sb.pixi.display.Container
    {
        public onInitialized: sb.signals.Signal0 = new sb.signals.Signal0(); //once when assets loaded
        public onActivated: sb.signals.Signal1 = new sb.signals.Signal1();
        public onDeactivated: sb.signals.Signal1 = new sb.signals.Signal1();
        public timeline: sb.time.ClockTimeline = new sb.time.ClockTimeline();


        private _initialized: boolean = false;
        private _engine: adservio.Engine;

        constructor()
        {
            super();
        }



        public initialize(engine: adservio.Engine) 
        {
            this._engine = engine;

            this.width = this._engine.stage.width;
            this.height = this._engine.stage.height;

            this._initialized = true;

            this.onInitialized.dispatch();
        }       

        public get engine(): adservio.Engine
        {
            if (this._initialized)
                return this._engine
            else
                Logger.warn("Screen not initialized!");
        }

        public get initialized(): boolean
        {
            return this._initialized;
        }

        public animateIn(callback?: Function)
        {
            this.alpha = 0;

            TweenMax.to(this, 1, { alpha: 1, onComplete: callback })
        }

        public animateOut(callback?: Function)
        {           
            TweenMax.to(this, 1, { alpha: 0, onComplete: callback })
        }
    }
}