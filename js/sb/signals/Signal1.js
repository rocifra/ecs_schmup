var sb;
(function (sb) {
    var signals;
    (function (signals) {
        class Signal1 extends signals.SignalBase {
            constructor() {
                super();
                this.dispatch = (data = null) => {
                    var i;
                    var length;
                    //dispatch listeners
                    //a dispatch might modify the array so we traverse it from tail
                    //regular listeners
                    length = this.listeners.length;
                    for (i = 0; i < this.listeners.length; i++) {
                        this.listeners[i].call(null, data);
                        //
                        var lengthChange = length - this.listeners.length;
                        if (lengthChange > 0) {
                            length -= lengthChange;
                            i--;
                        }
                    }
                    //once listeners
                    length = this.onceListeners.length;
                    for (i = 0; i < length; i++) {
                        this.onceListeners[i].call(null, data);
                        //remove onceListeners from array
                        this.onceListeners.splice(i, 1);
                        //
                        var lengthChange = length - this.onceListeners.length;
                        if (lengthChange > 0) {
                            length -= lengthChange;
                            i--;
                        }
                    }
                };
            }
        }
        signals.Signal1 = Signal1;
    })(signals = sb.signals || (sb.signals = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Signal1.js.map