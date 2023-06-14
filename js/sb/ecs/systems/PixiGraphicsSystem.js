var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var systems;
        (function (systems) {
            class PixiGraphicsSystem extends sb.ecs.System {
                constructor(params) {
                    super(false);
                    this.onPixiSpriteComponentAdded = (spriteComponent) => {
                        spriteComponent.sprite.texture = this._assetsManagerSystem.getTexture(spriteComponent.textureID);
                        this._stage.addChild(spriteComponent.sprite);
                    };
                    this.onPixiSpriteComponentRemoved = (spriteComponent) => {
                        this._stage.removeChild(spriteComponent.sprite);
                    };
                    this._stage = params.pixiGraphicsContainer;
                }
                //access to other systems
                activated() {
                    this._assetsManagerSystem = this.entityManager.systemManager.getSystemInstance("AssetsManagerSystem");
                    this.entityManager.signals.getComponentTypeSignalsByStringID("PixiSprite").added.add(this.onPixiSpriteComponentAdded);
                    this.entityManager.signals.getComponentTypeSignalsByStringID("PixiSprite").removed.add(this.onPixiSpriteComponentRemoved);
                }
                deactivated() {
                }
                get stage() { return this._stage; }
            }
            systems.PixiGraphicsSystem = PixiGraphicsSystem;
        })(systems = ecs.systems || (ecs.systems = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=PixiGraphicsSystem.js.map