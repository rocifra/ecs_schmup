namespace sb.time
{

    export class ClockTimeline extends sb.signals.Signal2
    {

        public timeScale: number = 1;

        private _isPaused = false;

        constructor(paused: boolean = false)
        {
            super()
            this._isPaused = paused;
        }

        public add(listenerFunction: (deltaMS: number, deltaSC: number) => void)
        {
            super.add(listenerFunction)
        }

        public remove(listenerFunction: (deltaMS: number, deltaSC: number) => void)
        {
            super.remove(listenerFunction);
        }

        public update = (deltaMS: number, deltaSC: number) =>
        {
            if (!this._isPaused)
            {
                this.dispatch(deltaMS * this.timeScale, deltaSC * this.timeScale)
            }
        }

        public pause = () =>
        {

        }
    }
        
}