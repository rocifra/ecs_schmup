var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        class ComponentManager {
            //private _componentMaps: Array<{ [stringID: string]: sb.ecs.Component }>;
            constructor() {
                this._componentStringIDArray = []; //used only to build component buckets
                this._componentPoolsMap = new Map(); // { [stringID: string]: sb.data.ObjectPool } = {};
                this._registeredConstructorsMap = new Map();
                this._intIDMap = new Map();
                this._idCounter = 0;
                this._initialized = false;
            }
            initialize(entityManager) {
                //debugging
                Logger.log("Initializing component manager");
                let beginTime = performance.now();
                //iterate constructors map
                for (let [key, value] of this._registeredConstructorsMap) {
                    let beginTime = performance.now();
                    //get indID
                    let intID = this._intIDMap.get(key);
                    //construct a pool for this type
                    let componentPool = new sb.data.ObjectPool(() => {
                        let newComponent = new value.constructor();
                        newComponent.stringID = key;
                        newComponent.intID = intID;
                        newComponent.entityManager = entityManager;
                        newComponent.initialized();
                        return newComponent;
                    }, value.initialPoolSize, true, 1, key);
                    //store the pool
                    this._componentPoolsMap.set(key, componentPool);
                    //create signals for this component type
                    entityManager.signals.createComponentTypeSignals(intID);
                    //debugging
                    Logger.log("Created component pool for type: [", key, "] , count: ", value.initialPoolSize, " duration: ", performance.now() - beginTime);
                }
                //debugging
                Logger.log("Component manager initialized in - ", performance.now() - beginTime);
            }
            registerComponentConstructor(constructor, initialPoolSize = 1) {
                if (constructor) {
                    let stringID = constructor.name;
                    let intID;
                    if (!this._registeredConstructorsMap.has(stringID)) {
                        intID = this._idCounter;
                        //inc id counter
                        this._idCounter++;
                        //map intID to stringID;
                        this._intIDMap.set(stringID, intID);
                        //save constructor in map
                        this._registeredConstructorsMap.set(stringID, { constructor: constructor, initialPoolSize: initialPoolSize });
                        //logging
                        Logger.log("Registered new component type: ", stringID, " with 'intID' - ", intID);
                    }
                    else
                        Logger.warn("Component constructor already registered for - ", stringID);
                }
                else
                    Logger.error("Invalid or missing component constructor. Component script possibly not included! ");
            }
            getComponentInstanceByStringID(stringID) {
                if (this._componentPoolsMap.has(stringID))
                    return this._componentPoolsMap.get(stringID).getInstanceFromPool();
                else
                    Logger.error("Invalid component type - ", stringID);
            }
            getEmptyComponentsBucket() {
                let bucket = new Map();
                for (let [key, value] of this._registeredConstructorsMap)
                    bucket.set(key, null);
                return bucket;
            }
            intIDLookup(stringID) {
                if (this._intIDMap.has(stringID))
                    return this._intIDMap.get(stringID);
                else
                    Logger.warn("intID not found for stringID - ", stringID);
            }
            recycleComponent(component) {
                if (this._componentPoolsMap.has(component.stringID))
                    this._componentPoolsMap.get(component.stringID).returnInstanceToPool(component);
                else
                    Logger.error("Invalid component type - ", component.stringID);
            }
            getComponentMapSize(constructorName) {
                return this._componentPoolsMap.get(constructorName).size;
            }
        }
        ecs.ComponentManager = ComponentManager;
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=ComponentManager.js.map