var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            class VectorMotion extends sb.ecs.Component {
                constructor() {
                    super(true);
                    this.speed = 0;
                    this.maxSpeed = 0;
                    this.acceleration = 0;
                    this.friction = 1;
                    this.setInspectable("speed", "number");
                    this.setInspectable("maxSpeed", "number");
                    this.setInspectable("acceleration", "number");
                    this.setInspectable("friction", "number");
                }
                attached() {
                    this._transform = this.entity.getComponent("Transform");
                }
                update(deltaMS, deltaSC) {
                    //accelerate
                    this.speed += this.acceleration;
                    if (this.speed > this.maxSpeed)
                        this.speed = this.maxSpeed;
                    //apply friction
                    this.speed *= this.friction;
                    this._transform.x += Math.cos(this._transform.rotation) * this.speed * deltaSC;
                    this._transform.y += Math.sin(this._transform.rotation) * this.speed * deltaSC;
                }
            }
            components.VectorMotion = VectorMotion;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=VectorMotion.js.map