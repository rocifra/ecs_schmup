namespace sb.ecs
{
    interface ISystemConstructObject
    {
        constructor: { new(parameters?: any): sb.ecs.System };
        constructorParameters: any;
    }

    export class SystemManager
    {
        private _entityManager: EntityManager;

        //system components
        private _registeredSystemConstructors_map: Map<string, ISystemConstructObject> = new Map();
        private _activeSystems_map: Map<string, sb.ecs.System> = new Map();
        private _dynamicSystems_array: Array<sb.ecs.System> = [];

        constructor()
        {

        }

        public initialize(entityManager: EntityManager): void
        {
            this._entityManager = entityManager;

            //activate systems
            for (let [key, system] of this._activeSystems_map)
            {
                system.entityManager = this._entityManager;
                system.activated();
            }
        }


        public registerSystemConstructor = (constructor: any, constructorParameters: any = null) =>
        {
            if (!this._registeredSystemConstructors_map.has(constructor.name))
            {
                this._registeredSystemConstructors_map.set(constructor.name, { constructor: constructor, constructorParameters: constructorParameters })
            }
            else
            {
                Logger.warn("System [", constructor.name, "] already registered!")
            }
        }

        public createSystem(constructorName: string, groupIndex: number = 0): void
        {
            if (!this._activeSystems_map.has(constructorName))
            {
                if (this._registeredSystemConstructors_map.has(constructorName))
                {
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

        public getSystemInstance(constructorName: string): System
        {
            if (this._activeSystems_map.has(constructorName))
                return this._activeSystems_map.get(constructorName)
            else
            {
                Logger.warn("Missing system - ", constructorName)
                return null
            }
               
        }

        public update = (deltaMS: number, deltaSC: number) =>
        {
            //update dynamic systems
            for (let i = 0; i < this._dynamicSystems_array.length; i++)
            {
                this._dynamicSystems_array[i].update(deltaMS, deltaSC)
            }
        }
    }
}