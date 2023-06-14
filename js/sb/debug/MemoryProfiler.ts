namespace sb.debug
{

    export class MemoryProfiler
    {

        public jsUsedHeapSize: number = 0;
        public jsTotalHeapSize: number = 0;
        public jsHeapSizeLimit: number = 0;
        public jsHeapSizeDelta: number = 0;

        public updateIntervalMS: number = 500;

        private _currentTime: number = 0;
        private _lastUsedJSHeapSize: number = 0;

        constructor()
        {

        }

        public update = (deltaMS: number, deltaSC: number) =>
        {
            if (this._currentTime > this.updateIntervalMS)
            {
                //reset current time
                this._currentTime = 0;

                let newMemoryStats: any = performance["memory"];

                //some browsers are missing this
                if (newMemoryStats)
                {
                    this.jsHeapSizeLimit = newMemoryStats.jsHeapSizeLimit;
                    this.jsTotalHeapSize = newMemoryStats.totalJSHeapSize;
                    this.jsUsedHeapSize = newMemoryStats.usedJSHeapSize;
                    this.jsHeapSizeDelta = this.jsUsedHeapSize - this._lastUsedJSHeapSize;


                    this._lastUsedJSHeapSize = this.jsUsedHeapSize;
                }
            }
            else
            {
                this._currentTime += deltaMS;
            }
        }

    }
}