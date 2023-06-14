var sb;
(function (sb) {
    var debug;
    (function (debug) {
        class Logger {
            constructor() {
                this.loggingLevel = 0;
                this.warn = (...params) => {
                    if (this.loggingLevel < 2)
                        console.warn.apply(console, params);
                };
                this.error = (...params) => {
                    if (this.loggingLevel < 3)
                        console.error.apply(console, params);
                };
            }
            log(...params) {
                if (this.loggingLevel < 1)
                    console.log.apply(console, params);
            }
        }
        debug.Logger = Logger;
    })(debug = sb.debug || (sb.debug = {}));
})(sb || (sb = {}));
var Logger = window["Logger"];
if (Logger) {
    console.log("'Logger' global namespace is in use!");
}
else {
    Logger = new sb.debug.Logger();
}
//# sourceMappingURL=Logger.js.map