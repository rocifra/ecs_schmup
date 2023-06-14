namespace sb.ecs
{


    export class EntityManager
    {
        private _entityPool: sb.data.ObjectPool;
        private _entities: Array<sb.ecs.Entity> = [];
        private _removalQueue: Array<sb.ecs.Entity> = [];

        private _systemManager: SystemManager;
        private _componentManager: sb.ecs.ComponentManager;
        private _signals: SignalManager;
        private _blueprintManager: managers.BlueprintManager;
        private _tagManager: managers.TagManager;

        //flags
        private _isInitialized: boolean = false;

        //stats
        private _totalRunTime: number = 0;
        private _totalEntitiesProcessTime: number = 0;
        private _lastEntitiesProcessTime: number = 0;
        private _totalSystemsProcessTime: number = 0;
        private _lastSystemsProcessTime: number = 0;
        private _ticks: number = 0;

        constructor()
        {
            //create managers
            this._systemManager = new SystemManager()
            this._componentManager = new ComponentManager();
            this._signals = new sb.ecs.SignalManager();
            this._blueprintManager = new managers.BlueprintManager(this);
            this._tagManager = new managers.TagManager();
        }

        private blankEntity_constructor = (): sb.ecs.Entity =>
        {
            return new sb.ecs.Entity(this);
        }

        public initialize = (entityPoolSize: number = 1) =>
        {
            if (!this._isInitialized)
            {
                let beginTime = performance.now();
                Logger.log(" * * * * * Initializing Entity Manager");

                //create entities pool
                this._entityPool = new sb.data.ObjectPool(this.blankEntity_constructor, entityPoolSize, true, 1, "Entity");

                //init component manager - start building component pools for registered component constructors
                this._componentManager.initialize(this);

                //init signal manager
                this._signals.initialize(this)

                //init system manager
                this._systemManager.initialize(this);

                this._isInitialized = true;
                Logger.log(" * * * * * Entity Manager initialized in - ", performance.now() - beginTime)
            }
            else
                Logger.warn("Entity Manager already initialized!");
        }

        public addEntity(entity: sb.ecs.Entity): void
        {
            if (entity.managerIndex == -1)
            {
                let component: sb.ecs.Component;
                let componentsArray: Array<sb.ecs.Component> = entity.componentsArray;

                entity.managerIndex = this._entities.length;

                //store entity in array
                this._entities.push(entity);

                //iterate all components and dispatch a signal for each type and activate them
                for (let i = componentsArray.length - 1; i > -1; i--)
                {
                    component = componentsArray[i];

                    //activate the component
                    component.activated();

                    this._signals.getComponentTypeSignalsByIntID(component.intID).added.dispatch(component);
                }

                //filter tags
                this.tagManager.filter(entity);
            }
            else
            {
                Logger.warn("This entity is already added to the manager!");
            }
        }

        public recycleEntity(entity: sb.ecs.Entity)
        {
            entity.deferredRecycleFlag = false;
            entity.deferredRemovalFlag = false;

            //clear entity / recycle components
            entity.dynamicComponents.length = 0;

            let componentBucket = entity.componentsBucket;
            let componentArray = entity.componentsArray;
            for (let i = 0; i < componentArray.length; i++)
            {
                let component = componentArray[i];
                component.detached();
                componentBucket.set(component.stringID, null);
                this._componentManager.recycleComponent(component);
            }
            componentArray.length = 0;

            //clear / recycle tags
            let tags = entity.tags;

            for (let i = 0; i < tags.length; i++)            
                this._tagManager.returnTagFilterSlot(tags[i]);
            //clear tags array
            tags.length = 0;

            //return the entity to pool
            this._entityPool.returnInstanceToPool(entity);
        }

        //safe
        public removeEntity(entity: sb.ecs.Entity, recycle: boolean = true)
        {
            if (entity.managerIndex > -1)
            {
                //we cannot remove any entities immediately - we must do a deferred removal
                this._removalQueue.push(entity);
                entity.deferredRemovalFlag = true;

                if (recycle)
                    entity.deferredRecycleFlag = true;
            }
            else
                Logger.warn("Trying to remove an entity that is not added to entity manager!");
        }

        public update = (deltaMS: number, deltaSC: number) =>
        {
            //inc total run time
            this._totalRunTime += deltaMS;
            this._ticks++;

            let i: number;
            let before = performance.now();

            //update entities
            for (i = this._entities.length - 1; i > -1; i--)
                this._entities[i].update(deltaMS, deltaSC);

            this._lastEntitiesProcessTime = (performance.now() - before);
            this._totalEntitiesProcessTime += this._lastEntitiesProcessTime;

            //update systems
            this._systemManager.update(deltaMS, deltaSC);

            this._lastSystemsProcessTime = (performance.now() - before - this._lastEntitiesProcessTime);
            this._totalSystemsProcessTime += this._lastSystemsProcessTime;

            /**
            for (i = this._dynamicSystemComponents_array.length - 1; i > -1; i--)
                this._dynamicSystemComponents_array[i].update(deltaMS, deltaSC);
                **/

            //process removal queue
            for (i = this._removalQueue.length - 1; i > -1; i--)
            {
                let entity = this._removalQueue[i];
                this._removalQueue.length--;

                //remove from entities array 
                //! fast removal => relocate last entity in the array to the index of the entity that is to be removed
                let lastEntity = this._entities[this._entities.length - 1];
                this._entities[entity.managerIndex] = lastEntity;
                //update indexes
                lastEntity.managerIndex = entity.managerIndex;
                //clear manager index of removed entity
                entity.managerIndex = -1;
                //clear last array slot
                this._entities.length--;

                //disable components
                let component: sb.ecs.Component;
                let componentsArray: Array<sb.ecs.Component> = entity.componentsArray;

                //iterate all components and dispatch a signal for each type and deactivate them
                for (let j = componentsArray.length - 1; j > -1; j--)
                {
                    component = componentsArray[j];

                    //deactivate the component
                    component.deactivated();

                    this._signals.getComponentTypeSignalsByIntID(component.intID).removed.dispatch(component);
                }

                //unfilter tags
                this._tagManager.unfilter(entity);

                //recycle if flag
                if (entity.deferredRecycleFlag)
                    this.recycleEntity(entity);
            }
        }

        public createEntityFromBlueprint(blueprintName: string): Entity
        {
            var entity: Entity = this.getFreeEntity();
            var blueprint = this._blueprintManager.getBlueprint(blueprintName);

            //compose newly created entity from blueprint
            //add components
            for (let [key, value] of blueprint.components)
            {
                let component = this._componentManager.getComponentInstanceByStringID(key);
                component.setProps(value);
                entity.addComponentInstance(component);
            }

            //add tags
            for (let i = 0; i < blueprint.tags.length; i++)
            {
                entity.addNumericTag(blueprint.tags[i]);
            }

            return entity;
        }





        public getFreeEntity(): sb.ecs.Entity { return this._entityPool.getInstanceFromPool() }
        public get componentManager(): sb.ecs.ComponentManager { return this._componentManager }
        public get systemManager(): sb.ecs.SystemManager { return this._systemManager }
        public get signals(): sb.ecs.SignalManager { return this._signals }
        public get blueprintManager(): managers.BlueprintManager { return this._blueprintManager }
        public get tagManager(): managers.TagManager { return this._tagManager }
        public get numLiveEntities(): number { return this._entities.length }
        public get removalQueueLength(): number { return this._removalQueue.length }
        public get totalEntitiesProcessTime(): number { return this._totalEntitiesProcessTime }
        public get totalSystemsProcessTime(): number { return this._totalSystemsProcessTime }
        public get totalRunTime(): number { return this._totalRunTime }
        public get ticks(): number { return this._ticks }
        public get lastEntitiesProcessTime(): number { return this._lastEntitiesProcessTime }
        public get lastSystemsProcessTime(): number { return this._lastSystemsProcessTime }

    }
}