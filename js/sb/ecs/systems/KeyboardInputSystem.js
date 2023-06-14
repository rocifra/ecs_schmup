var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var systems;
        (function (systems) {
            class KeyboardInputSystem extends sb.ecs.System {
                constructor(params) {
                    super(false);
                    this._keyIntents = new Map();
                    this._stateControlSignalsByKey = [];
                    this.keyDownHandler = (event) => {
                        let keyCode = event.keyCode;
                        let keyStateControlSignalsArray = this._stateControlSignalsByKey[keyCode];
                        if (keyStateControlSignalsArray) {
                            for (let i = 0; i < keyStateControlSignalsArray.length; i++)
                                keyStateControlSignalsArray[i].on.dispatch();
                        }
                    };
                    this.keyUpHandler = (event) => {
                        let keyCode = event.keyCode;
                        let keyStateControlSignalsArray = this._stateControlSignalsByKey[keyCode];
                        if (keyStateControlSignalsArray) {
                            for (let i = 0; i < keyStateControlSignalsArray.length; i++)
                                keyStateControlSignalsArray[i].off.dispatch();
                        }
                    };
                    this.registerStateControlSignal = (signalName, key) => {
                        var stateControlSignal = this.entityManager.signals.getStateControlSignal(signalName, true);
                        if (this._stateControlSignalsByKey[key]) {
                            //we have array
                            //check for duplicate
                            if (this._stateControlSignalsByKey[key].indexOf(stateControlSignal) > -1)
                                Logger.warn(`State control signal already registered [${signalName}]`);
                            else
                                this._stateControlSignalsByKey[key].push(stateControlSignal);
                        }
                        else {
                            //we don't have array - create one
                            this._stateControlSignalsByKey[key] = [];
                            this._stateControlSignalsByKey[key].push(stateControlSignal);
                        }
                    };
                }
                //access to other systems
                activated() {
                    document.addEventListener('keydown', this.keyDownHandler);
                    document.addEventListener('keyup', this.keyUpHandler);
                }
                deactivated() {
                    document.removeEventListener('keydown', this.keyDownHandler);
                    document.removeEventListener('keyup', this.keyUpHandler);
                }
            }
            KeyboardInputSystem.KEYBOARD = {
                A: 65,
                D: 68,
                S: 83,
                W: 87,
                LEFT_ARROW: 37,
                RIGHT_ARROW: 39,
                UP_ARROW: 38,
                DOWN_ARROW: 40,
                SHIFT: 16,
                ENTER: 13
            };
            systems.KeyboardInputSystem = KeyboardInputSystem;
        })(systems = ecs.systems || (ecs.systems = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=KeyboardInputSystem.js.map