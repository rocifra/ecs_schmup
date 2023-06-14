var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var signals;
        (function (signals) {
            var StateControlSignal;
            (function (StateControlSignal_1) {
                class StateControlSignal {
                    constructor() {
                        this.on = new sb.signals.Signal1();
                        this.off = new sb.signals.Signal1();
                    }
                }
                StateControlSignal_1.StateControlSignal = StateControlSignal;
            })(StateControlSignal = signals.StateControlSignal || (signals.StateControlSignal = {}));
        })(signals = ecs.signals || (ecs.signals = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=file1.js.map