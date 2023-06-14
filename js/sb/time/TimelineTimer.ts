namespace sb.time
{
    export class TimelineTimer
    {
        public onTick: sb.signals.Signal0 = new sb.signals.Signal0();
        public onEnd: sb.signals.Signal0 = new sb.signals.Signal0();
        public onUpdate: sb.signals.Signal0 = new sb.signals.Signal0();

        private _isStarted: boolean = false;
        private _currentTime: number = 0;
        private _timeline: sb.time.ClockTimeline;
        private _tickCount: number;
        private _currentTick: number = 0;
        private _tickFrequency: number;

        constructor(timeline: sb.time.ClockTimeline, tickFrequencyMS: number = 1000, tickCount: number = -1)
        {
            this._timeline = timeline;
            this._tickFrequency = tickFrequencyMS;
            this._tickCount = tickCount;
        }

        public reset = () =>
        {
            if (this._isStarted)
                this.stop();

            this._currentTime = 0;
            this._currentTick = 0;
        }



        public update = (deltaMS: number) =>
        {
            if (!this._isStarted)
                return

            this._currentTime += deltaMS;

            if (this._currentTime >= this._tickFrequency)
            {
                this._currentTime = 0;
                this._currentTick++;

                //dispatch timerEvent
                this.onTick.dispatch();

                //console.log("tick",this._currentTick)
                if (this._currentTick == this._tickCount)
                {
                    //stop timer
                    this.stop();
                    //console.log("ending")
                    this.onEnd.dispatch();
                }
            }

            this.onUpdate.dispatch();
        }

        public start = () =>
        {
            if (!this._isStarted)
            {
                this.reset();

                this._isStarted = true;

                //add to timeline
                this._timeline.add(this.update);
            }
        }

        public stop = () =>
        {
            if (this._isStarted)
            {
                this._isStarted = false;

                //remove from timeline
                this._timeline.remove(this.update) // _juggler.remove(this);               
            }
        }

        public get tickCount(): number { return this._tickCount }
        public set tickCount(value: number)
        {
            this._tickCount = value;
        }

        public get tickFrequency(): number { return this._tickFrequency }
        public set tickFrequency(value: number)
        {
            this._tickFrequency = value;
        }

        public get currentTickCount(): number { return this._currentTick }
        public get currentTime(): number { return this._currentTime }
    }
}