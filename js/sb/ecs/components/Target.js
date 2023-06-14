var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            class Target extends sb.ecs.Component {
                constructor() {
                    super(false);
                    this._targetedTransform = null;
                    this.setInspectable("targetableTag", "string");
                }
                get targetedTransform() {
                    if (!this._targetedTransform) {
                        //aquire target
                        let tagManager = this.entityManager.tagManager;
                        let targetables = tagManager.getFilteredEntitySlots(tagManager.getNumericTag(this.targetableTag));
                        let randomIndex = Math.floor(Math.random() * (targetables.length - 1));
                        this._targetedTransform = targetables[randomIndex].entity.getComponent("Transform");
                    }
                    return this._targetedTransform;
                }
            }
            components.Target = Target;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Target.js.map