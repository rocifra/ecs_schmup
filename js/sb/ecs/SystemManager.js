var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        class SystemManager {
            constructor() {
                //system components
                this._registeredSystemConstructors_map = new Map();
                this._activeSystems_map = new Map();
                this._dynamicSystems_array = [];
                this.registerSystemConstructor = (constructor, constructorParameters = null) => {
                    if (!this._registeredSystemConstructors_map.has(constructor.name)) {
                        this._registeredSystemConstructors_map.set(constructor.name, { constructor: constructor, constructorParameters: constructorParameters });
                    }
                    else {
                        Logger.warn("System [", constructor.name, "] already registered!");
                    }
                };
                this.update = (deltaMS, deltaSC) => {
                    //update dynamic systems
                    for (let i = 0; i < this._dynamicSystems_array.length; i++) {
                        this._dynamicSystems_array[i].update(deltaMS, deltaSC);
                    }
                };
            }
            initialize(entityManager) {
                this._entityManager = entityManager;
                //activate systems
                for (let [key, system] of this._activeSystems_map) {
                    system.entityManager = this._entityManager;
                    system.activated();
                }
            }
            createSystem(constructorName, groupIndex = 0) {
                if (!this._activeSystems_map.has(constructorName)) {
                    if (this._registeredSystemConstructors_map.has(constructorName)) {
                        //construct a system instance
                        let constructData = this._registeredSystemConstructors_map.get(constructorName);
                        let constructor = constructData.constructor;
                        let params = constructData.constructorParameters;
                        let system = new constructor(params);
                        this._activeSystems_map.set(constructorName, system);
                        if (system.isDynamic)
                            this._dynamicSystems_array.push(system);
                        system.entityManager = this._entityManager;
                    }
                    else
                        Logger.warn("System constructor not registered [", constructorName, "]");
                }
                else
                    Logger.warn("System [", constructorName, "] already added!");
            }
            getSystemInstance(constructorName) {
                if (this._activeSystems_map.has(constructorName))
                    return this._activeSystems_map.get(constructorName);
                else {
                    Logger.warn("Missing system - ", constructorName);
                    return null;
                }
            }
        }
        ecs.SystemManager = SystemManager;
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=SystemManager.js.map