namespace sb.ecs
{
    export class Entity
    {

        public managerIndex: number = -1;
        public tags: Array<ITagFilterSlot> = [];
        public deferredRemovalFlag: boolean = false;
        public deferredRecycleFlag: boolean = false;

        private _entityManager: sb.ecs.EntityManager;
        private _dynamicComponents: Array<sb.ecs.Component> = [];
        private _disabledDynamicComponentsBucket: Map<string, sb.ecs.Component>;
        private _componentsBucket: Map<string, sb.ecs.Component>;
        private _componentsArray: Array<sb.ecs.Component> = [];

        //helpers
        private _fastSplice = sb.util.ArrayUtil.fastSplice;


        constructor(entityManager: sb.ecs.EntityManager)
        {

            this._entityManager = entityManager;

            //set components bucket
            this._componentsBucket = this._entityManager.componentManager.getEmptyComponentsBucket();
            this._disabledDynamicComponentsBucket = this._entityManager.componentManager.getEmptyComponentsBucket();
        }

        public getComponent(componentName: string, autoCreate: boolean = true): sb.ecs.Component
        {
            let component: sb.ecs.Component = this._componentsBucket.get(componentName);

            if (!component)
            {
                if (autoCreate)
                {
                    //get a new component from the component manager
                    component = this._entityManager.componentManager.getComponentInstanceByStringID(componentName);

                    this.addComponentInstance(component);
                }
            }

            return component
        }

        public hasComponent(componentName: string): boolean
        {
            if (this.componentsBucket.has(componentName))
                return true
            else
                return false
        }

        public addComponentInstance(component: sb.ecs.Component)
        {
            //read bucket slot
            let componentSlot: sb.ecs.Component = this._componentsBucket.get(component.stringID);

            //strict-check for null (if TRUE - means that component type is valid and registered in the system and can be added safely to this entity)
            if (componentSlot === null)
            {
                //store in bucket
                this._componentsBucket.set(component.stringID, component);

                //store in array
                this._componentsArray.push(component);

                //check if dynamic
                if (component.isDynamic)
                {
                    //component.dynamicEntityArrayIndex = this._dynamicComponents.length;
                    this._dynamicComponents.push(component);
                }

                //set owner entity
                component.entity = this;

                //call component 'attached' method
                component.attached();
            }
            else if (componentSlot !== undefined)  //means there is present already a component of this type
            {
                Logger.warn("A component of this type is already added - ", component.stringID);
            }
            else //- means this type of component is unknown therefore not allowed
            {
                Logger.warn("You are trying to attach an illegal component! Type [" + component.stringID + "] not registered!")
            }
        }


        public addStringTag(tag: string)
        {
            this.addNumericTag(this.entityManager.tagManager.getNumericTag(tag));
        }

        public addNumericTag(numericTag: number)
        {
            //check if tag already exists
            if (!this.hasNumericTag(numericTag))
            {
                //get free tagDataObject from pool               
                let tag: ITagFilterSlot = this.entityManager.tagManager.getFreeTagFilterSlot();
                //init tagData
                tag.numericTag = numericTag;
                tag.entity = this;
                //store in entity tags
                this.tags.push(tag);
            }
        }


        public hasNumericTag(numericTag: number): boolean
        {
            //search in tags array for objects with this tag
            for (let i = 0; i < this.tags.length; i++)
                if (this.tags[i].numericTag == numericTag)
                    return true

            return false
        }


        public update(deltaMS: number, deltaSC: number) 
        {
            //update dynamic components
            for (var i = 0; i < this._dynamicComponents.length; i++)
                this._dynamicComponents[i].update(deltaMS, deltaSC)
        }

        public removeSelf(): void
        {
            this._entityManager.removeEntity(this);
        }

        public disableDynamicComponent(componentName: string)
        {           
            let component = this.getComponent(componentName, false);

            if (component)
            {
                let index = this._dynamicComponents.indexOf(component);
                //remove from dynamic array and put in paused
                this._fastSplice(this._dynamicComponents, index, 1);
                //this._dynamicComponents.splice(index, 1);
                this._disabledDynamicComponentsBucket.set(componentName, component);
            }
        }

        public enableDynamicComponent(componentName: string)
        {
            let component = this._disabledDynamicComponentsBucket.get(componentName);

            if (component)
            {
                this._disabledDynamicComponentsBucket.set(componentName, null);
                //enable
                this._dynamicComponents.push(component);
            }
            else
            {
                Logger.warn("Component type is not in the disabled components list!");
            }
        }

        public get componentsArray(): Array<sb.ecs.Component> { return this._componentsArray }
        public get dynamicComponents(): Array<sb.ecs.Component> { return this._dynamicComponents }
        public get componentsBucket(): Map<string, sb.ecs.Component> { return this._componentsBucket }
        public get entityManager(): sb.ecs.EntityManager { return this._entityManager }

    }
}