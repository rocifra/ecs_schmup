var sb;
(function (sb) {
    var time;
    (function (time) {
        class ClockTimeline extends sb.signals.Signal2 {
            constructor(paused = false) {
                super();
                this.timeScale = 1;
                this._isPaused = false;
                this.update = (deltaMS, deltaSC) => {
                    if (!this._isPaused) {
                        this.dispatch(deltaMS * this.timeScale, deltaSC * this.timeScale);
                    }
                };
                this.pause = () => {
                };
                this._isPaused = paused;
            }
            add(listenerFunction) {
                super.add(listenerFunction);
            }
            remove(listenerFunction) {
                super.remove(listenerFunction);
            }
        }
        time.ClockTimeline = ClockTimeline;
    })(time = sb.time || (sb.time = {}));
})(sb || (sb = {}));
//# sourceMappingURL=ClockTimeline.js.map