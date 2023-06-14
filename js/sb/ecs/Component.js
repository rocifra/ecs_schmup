var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        class Component {
            constructor(isDynamic) {
                this.entityManager = null;
                this._propsMap = new Map();
                this._isDynamic = isDynamic;
            }
            setInspectable(valueName, valueType) {
                if (!this._propsMap.has(valueName))
                    this._propsMap.set(valueName, valueType);
                else
                    Logger.error("Inspectable property '", valueName, "' already registered");
            }
            //OVERRIDEABLES
            //called once right after instance construction | systems are available here
            initialized() { }
            //called when attached to entity
            attached() { }
            //called when detached from entity
            detached() { }
            //called when entity is added to manager
            activated() { }
            //called when entity is removed from manager
            deactivated() { }
            //called each tick if component is set as dynamic | override to implement logic
            update(deltaMS, deltaSC) { }
            setProps(propsData) {
                for (var property in propsData) {
                    if (propsData.hasOwnProperty(property)) {
                        this[property] = propsData[property];
                    }
                }
            }
            get isDynamic() { return this._isDynamic; }
        }
        ecs.Component = Component;
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Component.js.map