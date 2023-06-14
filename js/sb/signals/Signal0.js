var sb;
(function (sb) {
    var signals;
    (function (signals) {
        class Signal0 extends signals.SignalBase {
            constructor() {
                super();
                this.dispatch = () => {
                    var i;
                    var length;
                    //dispatch listeners
                    //traverse from HEAD!
                    //regular listeners
                    length = this.listeners.length;
                    for (i = 0; i < this.listeners.length; i++) {
                        this.listeners[i].call(null);
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
                        this.onceListeners[i].call(null);
                        //remove onceListeners from array
                        this.onceListeners.splice(i, 1);
                        //
                        var lengthChange = length - this.onceListeners.length;
                        if (lengthChange > 0) {
                            length -= lengthChange;
                            i--;
                        }
                    }
                    /*
                    //a dispatch might modify the array so we traverse it from tail
                    //regular listeners
                    i = this.listeners.length - 1;
                    for (i; i >= 0; --i)
                    {
                        this.listeners[i].call(null);
                    }
        
                    //once listeners
                    i = this.onceListeners.length - 1;
                    for (i; i >= 0; --i)
                    {
                        this.onceListeners[i].call(null);
        
                        //remove onceListeners from array
                        this.onceListeners.splice(i, 1);
                    }
                    */
                };
            }
        }
        signals.Signal0 = Signal0;
    })(signals = sb.signals || (sb.signals = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Signal0.js.map