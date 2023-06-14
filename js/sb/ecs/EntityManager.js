var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        class EntityManager {
            constructor() {
                this._entities = [];
                this._removalQueue = [];
                //flags
                this._isInitialized = false;
                //stats
                this._totalRunTime = 0;
                this._totalEntitiesProcessTime = 0;
                this._lastEntitiesProcessTime = 0;
                this._totalSystemsProcessTime = 0;
                this._lastSystemsProcessTime = 0;
                this._ticks = 0;
                this.blankEntity_constructor = () => {
                    return new sb.ecs.Entity(this);
                };
                this.initialize = (entityPoolSize = 1) => {
                    if (!this._isInitialized) {
                        let beginTime = performance.now();
                        Logger.log(" * * * * * Initializing Entity Manager");
                        //create entities pool
                        this._entityPool = new sb.data.ObjectPool(this.blankEntity_constructor, entityPoolSize, true, 1, "Entity");
                        //init component manager - start building component pools for registered component constructors
                        this._componentManager.initialize(this);
                        //init signal manager
                        this._signals.initialize(this);
                        //init system manager
                        this._systemManager.initialize(this);
                        this._isInitialized = true;
                        Logger.log(" * * * * * Entity Manager initialized in - ", performance.now() - beginTime);
                    }
                    else
                        Logger.warn("Entity Manager already initialized!");
                };
                this.update = (deltaMS, deltaSC) => {
                    //inc total run time
                    this._totalRunTime += deltaMS;
                    this._ticks++;
                    let i;
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
                    for (i = this._removalQueue.length - 1; i > -1; i--) {
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
                        let component;
                        let componentsArray = entity.componentsArray;
                        //iterate all components and dispatch a signal for each type and deactivate them
                        for (let j = componentsArray.length - 1; j > -1; j--) {
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
                };
                //create managers
                this._systemManager = new ecs.SystemManager();
                this._componentManager = new ecs.ComponentManager();
                this._signals = new sb.ecs.SignalManager();
                this._blueprintManager = new ecs.managers.BlueprintManager(this);
                this._tagManager = new ecs.managers.TagManager();
            }
            addEntity(entity) {
                if (entity.managerIndex == -1) {
                    let component;
                    let componentsArray = entity.componentsArray;
                    entity.managerIndex = this._entities.length;
                    //store entity in array
                    this._entities.push(entity);
                    //iterate all components and dispatch a signal for each type and activate them
                    for (let i = componentsArray.length - 1; i > -1; i--) {
                        component = componentsArray[i];
                        //activate the component
                        component.activated();
                        this._signals.getComponentTypeSignalsByIntID(component.intID).added.dispatch(component);
                    }
                    //filter tags
                    this.tagManager.filter(entity);
                }
                else {
                    Logger.warn("This entity is already added to the manager!");
                }
            }
            recycleEntity(entity) {
                entity.deferredRecycleFlag = false;
                entity.deferredRemovalFlag = false;
                //clear entity / recycle components
                entity.dynamicComponents.length = 0;
                let componentBucket = entity.componentsBucket;
                let componentArray = entity.componentsArray;
                for (let i = 0; i < componentArray.length; i++) {
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
            removeEntity(entity, recycle = true) {
                if (entity.managerIndex > -1) {
                    //we cannot remove any entities immediately - we must do a deferred removal
                    this._removalQueue.push(entity);
                    entity.deferredRemovalFlag = true;
                    if (recycle)
                        entity.deferredRecycleFlag = true;
                }
                else
                    Logger.warn("Trying to remove an entity that is not added to entity manager!");
            }
            createEntityFromBlueprint(blueprintName) {
                var entity = this.getFreeEntity();
                var blueprint = this._blueprintManager.getBlueprint(blueprintName);
                //compose newly created entity from blueprint
                //add components
                for (let [key, value] of blueprint.components) {
                    let component = this._componentManager.getComponentInstanceByStringID(key);
                    component.setProps(value);
                    entity.addComponentInstance(component);
                }
                //add tags
                for (let i = 0; i < blueprint.tags.length; i++) {
                    entity.addNumericTag(blueprint.tags[i]);
                }
                return entity;
            }
            getFreeEntity() { return this._entityPool.getInstanceFromPool(); }
            get componentManager() { return this._componentManager; }
            get systemManager() { return this._systemManager; }
            get signals() { return this._signals; }
            get blueprintManager() { return this._blueprintManager; }
            get tagManager() { return this._tagManager; }
            get numLiveEntities() { return this._entities.length; }
            get removalQueueLength() { return this._removalQueue.length; }
            get totalEntitiesProcessTime() { return this._totalEntitiesProcessTime; }
            get totalSystemsProcessTime() { return this._totalSystemsProcessTime; }
            get totalRunTime() { return this._totalRunTime; }
            get ticks() { return this._ticks; }
            get lastEntitiesProcessTime() { return this._lastEntitiesProcessTime; }
            get lastSystemsProcessTime() { return this._lastSystemsProcessTime; }
        }
        ecs.EntityManager = EntityManager;
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=EntityManager.js.map