var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            class BLANK_MODEL extends sb.ecs.Component {
                constructor() {
                    super(false);
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
                    super.setProps(propsData);
                }
            }
            components.BLANK_MODEL = BLANK_MODEL;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=@BLANK_MODEL.js.map