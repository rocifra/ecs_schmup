//enforces single instances
var sb;
//enforces single instances
(function (sb) {
    var ecs;
    (function (ecs) {
        var systems;
        (function (systems) {
            class AssetsManagerSystem extends sb.ecs.System {
                constructor(params) {
                    super(false);
                    this._assets = params.assets;
                }
                getTexture(textureID) {
                    return this._assets.getTexture(textureID);
                }
            }
            systems.AssetsManagerSystem = AssetsManagerSystem;
        })(systems = ecs.systems || (ecs.systems = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=AssetsManagerSystem.js.map