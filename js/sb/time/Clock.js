var sb;
(function (sb) {
    var time;
    (function (time) {
        class Clock {
            constructor() {
                this.timeline = new time.ClockTimeline();
                this.FPS = 0;
                this.TOTAL_TIME = 0;
                //public timeScale: number = 1;
                this.TARGET_FPS = 60;
                this._isStarted = false;
                this._maxDeltaMS = 30;
                this.update = () => {
                    let now = performance.now();
                    //update delta time
                    this._deltaMS = now - this._lastFrameTimeStamp;
                    //update total_time
                    this.TOTAL_TIME += this._deltaMS;
                    // to avoid overloading time-based animations, the maximum delta is truncated.
                    if (this._deltaMS > this._maxDeltaMS)
                        this._deltaMS = this._maxDeltaMS;
                    //calculate scalar delta
                    this._deltaScalar = this._deltaMS / this._targetDeltaMS;
                    //update lastFrameTimeStamp
                    this._lastFrameTimeStamp = now;
                    //dispatch tick signal
                    this.timeline.update(this._deltaMS, this._deltaScalar);
                    //calculate FPS
                    this.FPS = 1000 / this._deltaMS;
                    if (this._isStarted)
                        requestAnimationFrame(this.update);
                };
                this.start = () => {
                    if (!this._isStarted) {
                        this._isStarted = true;
                        this._lastFrameTimeStamp = performance.now();
                        requestAnimationFrame(this.update);
                    }
                };
                this.stop = () => {
                    if (this._isStarted) {
                        this._isStarted = false;
                    }
                };
                this._targetDeltaMS = 1000 / this.TARGET_FPS;
            }
        }
        time.Clock = Clock;
    })(time = sb.time || (sb.time = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Clock.js.map