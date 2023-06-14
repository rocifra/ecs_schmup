var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            //requires Transform component   
            class DeathSpawn extends sb.ecs.Component {
                constructor() {
                    super(false);
                }
                attached() {
                    this._transform = this.entity.getComponent("Transform");
                }
                deactivated() {
                    let explosion = this.entityManager.createEntityFromBlueprint(this.entityBlueprint);
                    let explosionTransform = explosion.getComponent("Transform");
                    explosionTransform.x = this._transform.x;
                    explosionTransform.y = this._transform.y;
                    explosionTransform.rotation = this._transform.rotation;
                    this.entityManager.addEntity(explosion);
                }
            }
            components.DeathSpawn = DeathSpawn;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=DeathSpawn.js.map