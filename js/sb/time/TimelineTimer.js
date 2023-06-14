var sb;
(function (sb) {
    var time;
    (function (time) {
        class TimelineTimer {
            constructor(timeline, tickFrequencyMS = 1000, tickCount = -1) {
                this.onTick = new sb.signals.Signal0();
                this.onEnd = new sb.signals.Signal0();
                this.onUpdate = new sb.signals.Signal0();
                this._isStarted = false;
                this._currentTime = 0;
                this._currentTick = 0;
                this.reset = () => {
                    if (this._isStarted)
                        this.stop();
                    this._currentTime = 0;
                    this._currentTick = 0;
                };
                this.update = (deltaMS) => {
                    if (!this._isStarted)
                        return;
                    this._currentTime += deltaMS;
                    if (this._currentTime >= this._tickFrequency) {
                        this._currentTime = 0;
                        this._currentTick++;
                        //dispatch timerEvent
                        this.onTick.dispatch();
                        //console.log("tick",this._currentTick)
                        if (this._currentTick == this._tickCount) {
                            //stop timer
                            this.stop();
                            //console.log("ending")
                            this.onEnd.dispatch();
                        }
                    }
                    this.onUpdate.dispatch();
                };
                this.start = () => {
                    if (!this._isStarted) {
                        this.reset();
                        this._isStarted = true;
                        //add to timeline
                        this._timeline.add(this.update);
                    }
                };
                this.stop = () => {
                    if (this._isStarted) {
                        this._isStarted = false;
                        //remove from timeline
                        this._timeline.remove(this.update); // _juggler.remove(this);               
                    }
                };
                this._timeline = timeline;
                this._tickFrequency = tickFrequencyMS;
                this._tickCount = tickCount;
            }
            get tickCount() { return this._tickCount; }
            set tickCount(value) {
                this._tickCount = value;
            }
            get tickFrequency() { return this._tickFrequency; }
            set tickFrequency(value) {
                this._tickFrequency = value;
            }
            get currentTickCount() { return this._currentTick; }
            get currentTime() { return this._currentTime; }
        }
        time.TimelineTimer = TimelineTimer;
    })(time = sb.time || (sb.time = {}));
})(sb || (sb = {}));
//# sourceMappingURL=TimelineTimer.js.map