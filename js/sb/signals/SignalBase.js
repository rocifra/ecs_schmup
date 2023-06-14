var sb;
(function (sb) {
    var signals;
    (function (signals) {
        class SignalBase {
            constructor() {
                this.listeners = new Array();
                this.onceListeners = new Array();
            }
            registerListener(listener, once = false) {
                if (once == true) {
                    //don't register twice
                    if (this.onceListeners.indexOf(listener) < 0)
                        this.onceListeners.push(listener);
                }
                else {
                    //don't register twice
                    if (this.listeners.indexOf(listener) < 0) {
                        this.listeners.push(listener);
                    }
                    else {
                        console.warn("Duplicate signal handler registration attempted!");
                    }
                }
            }
            add(listener) {
                this.registerListener(listener);
            }
            addOnce(listener) {
                this.registerListener(listener, true);
            }
            remove(listener) {
                var listenerIndex = this.listeners.indexOf(listener);
                if (listenerIndex >= 0)
                    this.listeners.splice(listenerIndex, 1);
            }
            removeAll() {
                this.listeners.length = 0;
                this.onceListeners.length = 0;
            }
        }
        signals.SignalBase = SignalBase;
    })(signals = sb.signals || (sb.signals = {}));
})(sb || (sb = {}));
//# sourceMappingURL=SignalBase.js.map