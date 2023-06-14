var sb;
(function (sb) {
    var debug;
    (function (debug) {
        class MemoryProfiler {
            constructor() {
                this.jsUsedHeapSize = 0;
                this.jsTotalHeapSize = 0;
                this.jsHeapSizeLimit = 0;
                this.jsHeapSizeDelta = 0;
                this.updateIntervalMS = 500;
                this._currentTime = 0;
                this._lastUsedJSHeapSize = 0;
                this.update = (deltaMS, deltaSC) => {
                    if (this._currentTime > this.updateIntervalMS) {
                        //reset current time
                        this._currentTime = 0;
                        let newMemoryStats = performance["memory"];
                        //some browsers are missing this
                        if (newMemoryStats) {
                            this.jsHeapSizeLimit = newMemoryStats.jsHeapSizeLimit;
                            this.jsTotalHeapSize = newMemoryStats.totalJSHeapSize;
                            this.jsUsedHeapSize = newMemoryStats.usedJSHeapSize;
                            this.jsHeapSizeDelta = this.jsUsedHeapSize - this._lastUsedJSHeapSize;
                            this._lastUsedJSHeapSize = this.jsUsedHeapSize;
                        }
                    }
                    else {
                        this._currentTime += deltaMS;
                    }
                };
            }
        }
        debug.MemoryProfiler = MemoryProfiler;
    })(debug = sb.debug || (sb.debug = {}));
})(sb || (sb = {}));
//# sourceMappingURL=MemoryProfiler.js.map