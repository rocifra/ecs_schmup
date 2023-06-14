var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            class RopeTrail extends sb.ecs.Component {
                //requires transform
                constructor() {
                    super(false);
                    this.segmentsCount = 5;
                    this.historySize = 5;
                }
                //OVERRIDEABLES
                //called once right after instance construction | systems are available here
                initialized() { }
                //called when attached to entity
                attached() {
                    this.cTransform = this.entity.getComponent("Transform");
                }
                //called when detached from entity
                detached() { }
                //called when entity is added to manager
                activated() { }
                //called when entity is removed from manager
                deactivated() { }
                //called each tick if component is set as dynamic | override to implement logic
                update(deltaMS, deltaSC) { }
                setProps(propsData) {
                    super.setProps(propsData);
                }
            }
            components.RopeTrail = RopeTrail;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=RopeTrails.js.map