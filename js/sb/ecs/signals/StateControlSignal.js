var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var signals;
        (function (signals) {
            class StateControlSignal {
                constructor() {
                    this.on = new sb.signals.Signal1();
                    this.off = new sb.signals.Signal1();
                }
            }
            signals.StateControlSignal = StateControlSignal;
        })(signals = ecs.signals || (ecs.signals = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=StateControlSignal.js.map