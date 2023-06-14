var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            //requires Transform component
            class MisterBouncy extends sb.ecs.Component {
                constructor() {
                    super(true);
                    this._gravity = 0.75;
                    this._speedX = Math.random() * 10;
                    this._speedY = (Math.random() * 10) - 5;
                    this._friction = 1;
                }
                attached() {
                    this._transform = this.entity.getComponent("Transform");
                    this._graphicsSystem = this.entity.entityManager.systemManager.getSystemInstance("PixiGraphicsSystem");
                    this._graphicsSystem.stage.showBounds();
                    this._bounds = new PIXI.Rectangle(0, 0, this._graphicsSystem.stage.width, this._graphicsSystem.stage.height);
                    //let view = this._graphicsSystem.stage;            
                }
                update(deltaMS, deltaSC) {
                    this._speedY += this._gravity;
                    this._speedX *= this._friction;
                    this._speedY *= this._friction;
                    this._transform.x += this._speedX;
                    this._transform.y += this._speedY;
                    if (this._transform.x > this._bounds.right) {
                        this._transform.x -= this._speedX;
                        this._speedX *= -1;
                    }
                    else if (this._transform.x < this._bounds.left) {
                        this._transform.x = this._speedX;
                        this._speedX *= -1;
                    }
                    if (this._transform.y > this._bounds.bottom) {
                        this._transform.y -= this._speedY;
                        this._speedY -= this._gravity;
                        this._speedY *= -1;
                        /*
                        if (Math.random() > 0.5)
                        {
                            this._speedY -= Math.random() * 6;
                        }
                        */
                    }
                    else if (this._transform.y < this._bounds.top) {
                        this._speedY *= -1;
                        this._transform.y = this._bounds.top;
                    }
                }
            }
            components.MisterBouncy = MisterBouncy;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=MisterBouncy.js.map