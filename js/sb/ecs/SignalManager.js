var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        class SignalManager {
            constructor() {
                //this.onInitialized.add(asdasdasd)
                //private onInitialized = new sb.signals.si()
                this._componentSignals = [];
                this._genericSignalsIndexMap = new Map();
                this._stateControlSignalsMap = new Map();
                this._stateControlSignalsArray = [];
                this.createStateControlSignal = (signalName) => {
                    var controlSignal;
                    if (!this._stateControlSignalsMap.has(signalName)) {
                        controlSignal = new sb.ecs.signals.StateControlSignal();
                        this._stateControlSignalsMap.set(signalName, controlSignal);
                        this._stateControlSignalsArray.push(controlSignal);
                        Logger.log(`New state control signal created [${signalName}]`);
                    }
                    else
                        Logger.warn(`A  state control signal with this name [${signalName}] already created!`);
                    return controlSignal;
                };
                this.getStateControlSignal = (signalName, autoCreate = false) => {
                    var signal = this._stateControlSignalsMap.get(signalName);
                    if (!signal) {
                        if (autoCreate)
                            signal = this.createStateControlSignal(signalName);
                        else
                            Logger.warn(`State control signal ${signalName} not found!`);
                    }
                    return signal;
                };
                this.createGenericSignal = (signalName) => {
                    var signal;
                    if (!this._genericSignalsIndexMap.has(signalName)) {
                        signal = new sb.signals.Signal1();
                        this._genericSignalsIndexMap.set(signalName, signal);
                        Logger.log(`New generic signal created [${signalName}]`);
                    }
                    else {
                        Logger.warn(`A signal with this name [${signalName}] already created!`);
                    }
                    return signal;
                };
                this.getGenericSignalByName = (signalName) => {
                    var signal = this._genericSignalsIndexMap.get(signalName);
                    if (!signal) {
                        signal = this.createGenericSignal(signalName);
                        Logger.warn(`Generic signal ${signalName} not found! Created new instance!`);
                    }
                    return signal;
                };
            }
            initialize(entityManager) {
                this._entityManager = entityManager;
            }
            getComponentTypeSignalsByStringID(constructorName) {
                let intID = this._entityManager.componentManager.intIDLookup(constructorName);
                return this.getComponentTypeSignalsByIntID(intID);
            }
            getComponentTypeSignalsByIntID(intID) {
                if (intID < this._componentSignals.length)
                    return this._componentSignals[intID];
                else
                    Logger.warn("Invalid component ID - ", intID);
            }
            createComponentTypeSignals(componentTypeIntID) {
                this._componentSignals[componentTypeIntID] = new ComponentSignals();
            }
        }
        ecs.SignalManager = SignalManager;
        class ComponentSignals {
            constructor() {
                this.added = new sb.signals.Signal1();
                this.removed = new sb.signals.Signal1();
            }
        }
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=SignalManager.js.map