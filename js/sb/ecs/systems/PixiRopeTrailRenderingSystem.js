var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var systems;
        (function (systems) {
            class PixiRopeTrailRenderingSystem extends sb.ecs.System {
                constructor(params) {
                    super(true);
                    this.historyX = [];
                    this.historyY = [];
                    //historySize determines how long the trail will be.
                    this.historySize = 20;
                    //ropeSize determines how smooth the trail will be.
                    this.ropeSize = 100;
                    this.points = [];
                    this.onRopeTrailComponentAdded = (spriteComponent) => {
                        //spriteComponent.sprite.texture = this._assetsManagerSystem.getTexture(spriteComponent.textureID);
                        this._stage.addChild(spriteComponent.sprite);
                    };
                    this.onPixiSpriteComponentRemoved = (spriteComponent) => {
                        this._stage.removeChild(spriteComponent.sprite);
                    };
                    super(false);
                    this._stage = params.container;
                }
                //access to other systems
                activated() {
                    // this._assetsManagerSystem = <sb.ecs.systems.AssetsManagerSystem>this.entityManager.systemManager.getSystemInstance("AssetsManagerSystem");
                    this.entityManager.signals.getComponentTypeSignalsByStringID("RopeTrail").added.add(this.onRopeTrailComponentAdded);
                    this.entityManager.signals.getComponentTypeSignalsByStringID("RopeTrail").removed.add(this.onPixiSpriteComponentRemoved);
                }
                update() {
                }
            }
            systems.PixiRopeTrailRenderingSystem = PixiRopeTrailRenderingSystem;
        })(systems = ecs.systems || (ecs.systems = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=PixiRopeTrailRenderingSystem.js.map