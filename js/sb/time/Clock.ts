namespace sb.time
{
    export class Clock
    {
        public timeline: ClockTimeline = new ClockTimeline();
        public FPS: number = 0;
        public TOTAL_TIME: number = 0;
        //public timeScale: number = 1;

        private TARGET_FPS: number = 60;


        private _isStarted: boolean = false;
        private _maxDeltaMS: number = 30;
        private _targetDeltaMS: number;
        private _deltaMS: number;
        private _deltaScalar: number;
        private _lastFrameTimeStamp: number;

        constructor()
        {
            this._targetDeltaMS = 1000 / this.TARGET_FPS;
        }

        private update = () =>
        {
            let now: number = performance.now();

            //update delta time
            this._deltaMS = now - this._lastFrameTimeStamp;

            //update total_time
            this.TOTAL_TIME += this._deltaMS;

            // to avoid overloading time-based animations, the maximum delta is truncated.
            if (this._deltaMS > this._maxDeltaMS) this._deltaMS = this._maxDeltaMS;

            //calculate scalar delta
            this._deltaScalar = this._deltaMS / this._targetDeltaMS;

            //update lastFrameTimeStamp
            this._lastFrameTimeStamp = now;

            //dispatch tick signal
            this.timeline.update(this._deltaMS, this._deltaScalar)

            //calculate FPS
            this.FPS =1000/ this._deltaMS;
            
            if (this._isStarted)
                requestAnimationFrame(this.update);
        }

        public start = () =>
        {
            if (!this._isStarted)
            {
                this._isStarted = true;

                this._lastFrameTimeStamp = performance.now()

                requestAnimationFrame(this.update)
            }
        }

        public stop = () =>
        {
            if (this._isStarted)
            {
                this._isStarted = false;
            }
        }
    }

}