var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var systems;
        (function (systems) {
            class FXPixiTrailsRenderingSystem extends sb.ecs.System {
                constructor(params) {
                    super(false);
                    this._container = params.container;
                }
            }
            systems.FXPixiTrailsRenderingSystem = FXPixiTrailsRenderingSystem;
        })(systems = ecs.systems || (ecs.systems = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=FXTrailsSystem.js.map