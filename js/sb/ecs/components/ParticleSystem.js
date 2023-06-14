var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            class ParticleSystem extends sb.ecs.Component {
                constructor() {
                    super(false);
                }
                attached() {
                    this.transform = this.entity.getComponent("Transform");
                }
            }
            components.ParticleSystem = ParticleSystem;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=ParticleSystem.js.map