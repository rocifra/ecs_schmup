var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        class Entity {
            constructor(entityManager) {
                this.managerIndex = -1;
                this.tags = [];
                this.deferredRemovalFlag = false;
                this.deferredRecycleFlag = false;
                this._dynamicComponents = [];
                this._componentsArray = [];
                //helpers
                this._fastSplice = sb.util.ArrayUtil.fastSplice;
                this._entityManager = entityManager;
                //set components bucket
                this._componentsBucket = this._entityManager.componentManager.getEmptyComponentsBucket();
                this._disabledDynamicComponentsBucket = this._entityManager.componentManager.getEmptyComponentsBucket();
            }
            getComponent(componentName, autoCreate = true) {
                let component = this._componentsBucket.get(componentName);
                if (!component) {
                    if (autoCreate) {
                        //get a new component from the component manager
                        component = this._entityManager.componentManager.getComponentInstanceByStringID(componentName);
                        this.addComponentInstance(component);
                    }
                }
                return component;
            }
            hasComponent(componentName) {
                if (this.componentsBucket.has(componentName))
                    return true;
                else
                    return false;
            }
            addComponentInstance(component) {
                //read bucket slot
                let componentSlot = this._componentsBucket.get(component.stringID);
                //strict-check for null (if TRUE - means that component type is valid and registered in the system and can be added safely to this entity)
                if (componentSlot === null) {
                    //store in bucket
                    this._componentsBucket.set(component.stringID, component);
                    //store in array
                    this._componentsArray.push(component);
                    //check if dynamic
                    if (component.isDynamic) {
                        //component.dynamicEntityArrayIndex = this._dynamicComponents.length;
                        this._dynamicComponents.push(component);
                    }
                    //set owner entity
                    component.entity = this;
                    //call component 'attached' method
                    component.attached();
                }
                else if (componentSlot !== undefined) //means there is present already a component of this type
                 {
                    Logger.warn("A component of this type is already added - ", component.stringID);
                }
                else //- means this type of component is unknown therefore not allowed
                 {
                    Logger.warn("You are trying to attach an illegal component! Type [" + component.stringID + "] not registered!");
                }
            }
            addStringTag(tag) {
                this.addNumericTag(this.entityManager.tagManager.getNumericTag(tag));
            }
            addNumericTag(numericTag) {
                //check if tag already exists
                if (!this.hasNumericTag(numericTag)) {
                    //get free tagDataObject from pool               
                    let tag = this.entityManager.tagManager.getFreeTagFilterSlot();
                    //init tagData
                    tag.numericTag = numericTag;
                    tag.entity = this;
                    //store in entity tags
                    this.tags.push(tag);
                }
            }
            hasNumericTag(numericTag) {
                //search in tags array for objects with this tag
                for (let i = 0; i < this.tags.length; i++)
                    if (this.tags[i].numericTag == numericTag)
                        return true;
                return false;
            }
            update(deltaMS, deltaSC) {
                //update dynamic components
                for (var i = 0; i < this._dynamicComponents.length; i++)
                    this._dynamicComponents[i].update(deltaMS, deltaSC);
            }
            removeSelf() {
                this._entityManager.removeEntity(this);
            }
            disableDynamicComponent(componentName) {
                let component = this.getComponent(componentName, false);
                if (component) {
                    let index = this._dynamicComponents.indexOf(component);
                    //remove from dynamic array and put in paused
                    this._fastSplice(this._dynamicComponents, index, 1);
                    //this._dynamicComponents.splice(index, 1);
                    this._disabledDynamicComponentsBucket.set(componentName, component);
                }
            }
            enableDynamicComponent(componentName) {
                let component = this._disabledDynamicComponentsBucket.get(componentName);
                if (component) {
                    this._disabledDynamicComponentsBucket.set(componentName, null);
                    //enable
                    this._dynamicComponents.push(component);
                }
                else {
                    Logger.warn("Component type is not in the disabled components list!");
                }
            }
            get componentsArray() { return this._componentsArray; }
            get dynamicComponents() { return this._dynamicComponents; }
            get componentsBucket() { return this._componentsBucket; }
            get entityManager() { return this._entityManager; }
        }
        ecs.Entity = Entity;
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Entity.js.map