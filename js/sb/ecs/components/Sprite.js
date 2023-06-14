var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            //requires Transform component   
            class Sprite extends sb.ecs.Component {
                //private _graphicsSystem: sb.ecs.systems.PixiGraphicsSystem;
                //private _assetsManager: sb.ecs.systems.AssetsManager
                constructor() {
                    super(true);
                    this.anchorX = 0.5;
                    this.anchorY = 0.5;
                    this.pivotX = 0;
                    this.pivotY = 0;
                    //width /height/anchorX/anchorY
                    this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
                    this.setInspectable("textureID", "string");
                    this.setInspectable("anchorX", "number");
                    this.setInspectable("anchorY", "number");
                    this.setInspectable("pivotX", "number");
                    this.setInspectable("pivotY", "number");
                }
                attached() {
                    this._transform = this.entity.getComponent("Transform");
                }
                activated() {
                    this.sprite.pivot.set(this.pivotX, this.pivotY);
                    this.sprite.anchor.set(this.anchorX, this.anchorY);
                    this.sprite.position.set(this._transform.x, this._transform.y);
                    /*
                    this.sprite.texture = this._assetsManager.getTexture(this.textureID);
                   
                    this._graphicsSystem.stage.addChild(this.sprite);
                    */
                }
                deactivated() {
                    // this.sprite.parent.removeChild(this.sprite);
                }
                update(deltaMS, deltaSC) {
                    this.sprite.position.set(this._transform.x, this._transform.y);
                    this.sprite.rotation = this._transform.rotation;
                }
            }
            components.Sprite = Sprite;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Sprite.js.map