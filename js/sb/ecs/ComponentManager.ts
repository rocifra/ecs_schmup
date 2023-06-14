namespace sb.ecs
{
    export class ComponentManager
    {
        private _componentStringIDArray: Array<string> = []; //used only to build component buckets

        private _componentPoolsMap: Map<string, sb.data.ObjectPool> = new Map()// { [stringID: string]: sb.data.ObjectPool } = {};
        private _registeredConstructorsMap: Map<string, { constructor: { new(): sb.ecs.Component }, initialPoolSize: number }> = new Map();
        private _intIDMap: Map<string, number> = new Map();

        private _idCounter: number = 0;
        private _initialized: boolean = false;

        //private _componentMaps: Array<{ [stringID: string]: sb.ecs.Component }>;



        constructor()
        {

        }

        public initialize(entityManager: sb.ecs.EntityManager): void
        {
            //debugging
            Logger.log("Initializing component manager");

            let beginTime: number = performance.now();

            //iterate constructors map
            for (let [key, value] of this._registeredConstructorsMap)
            {
                let beginTime: number = performance.now();

                //get indID
                let intID = this._intIDMap.get(key);

                //construct a pool for this type
                let componentPool: sb.data.ObjectPool = new sb.data.ObjectPool((): sb.ecs.Component =>
                {
                    let newComponent: sb.ecs.Component = new value.constructor();
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

        public registerComponentConstructor(constructor: { new(): sb.ecs.Component }, initialPoolSize: number = 1): void
        {
            if (constructor)
            {
                let stringID: string = constructor.name;
                let intID: number;

                if (!this._registeredConstructorsMap.has(stringID))
                {
                    intID = this._idCounter;

                    //inc id counter
                    this._idCounter++;

                    //map intID to stringID;
                    this._intIDMap.set(stringID, intID);

                    //save constructor in map
                    this._registeredConstructorsMap.set(stringID, { constructor: constructor, initialPoolSize: initialPoolSize });

                    //logging
                    Logger.log("Registered new component type: ", stringID, " with 'intID' - ", intID)
                }
                else
                    Logger.warn("Component constructor already registered for - ", stringID);
            }
            else
                Logger.error("Invalid or missing component constructor. Component script possibly not included! ");
        }

        public getComponentInstanceByStringID(stringID: string): sb.ecs.Component
        {
            if (this._componentPoolsMap.has(stringID))
                return this._componentPoolsMap.get(stringID).getInstanceFromPool();
            else
                Logger.error("Invalid component type - ", stringID);
        }


        public getEmptyComponentsBucket(): Map<string, sb.ecs.Component>
        {
            let bucket: Map<string, sb.ecs.Component> = new Map();

            for (let [key, value] of this._registeredConstructorsMap)
                bucket.set(key, null);

            return bucket
        }

        public intIDLookup(stringID: string): number
        {
            if (this._intIDMap.has(stringID))
                return this._intIDMap.get(stringID);
            else
                Logger.warn("intID not found for stringID - ", stringID);
        }

        public recycleComponent(component: sb.ecs.Component)
        {
            if (this._componentPoolsMap.has(component.stringID))
                this._componentPoolsMap.get(component.stringID).returnInstanceToPool(component);
            else
                Logger.error("Invalid component type - ", component.stringID);
        }

        public getComponentMapSize(constructorName: string): number
        {
            return this._componentPoolsMap.get(constructorName).size;
        }



    }
}