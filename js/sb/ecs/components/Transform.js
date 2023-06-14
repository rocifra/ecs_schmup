var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            class Transform extends sb.ecs.Component {
                constructor() {
                    super(false);
                    this.x = 0;
                    this.y = 0;
                    this.rotation = 0;
                    this.setInspectable("x", "number");
                    this.setInspectable("y", "number");
                    this.setInspectable("rotation", "number");
                }
            }
            components.Transform = Transform;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Transform.js.map