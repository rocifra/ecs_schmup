var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            //requires Transform component
            class KeyboardPositionController extends sb.ecs.Component {
                constructor() {
                    super(true);
                    this.acceleration = 0;
                    this.friction = 1;
                    this._speedX = 0;
                    this._speedY = 0;
                    this._accDown = 0;
                    this._accUp = 0;
                    this._accLeft = 0;
                    this._accRight = 0;
                    this.keyDownHandler = (event) => {
                        if (event.keyCode == 37) {
                            //left arrow pressed
                            this._accLeft = -this.acceleration;
                        }
                        else if (event.keyCode == 38) {
                            //up arrow was pressed
                            this._accUp = -this.acceleration;
                        }
                        else if (event.keyCode == 39) {
                            //right arrow was pressed
                            this._accRight = this.acceleration;
                        }
                        else if (event.keyCode == 40) {
                            //down arrow was pressed
                            this._accDown = this.acceleration;
                        }
                    };
                    this.keyUpHandler = (event) => {
                        if (event.keyCode == 37) {
                            //left arrow pressed
                            this._accLeft = 0;
                        }
                        else if (event.keyCode == 38) {
                            //up arrow was pressed
                            this._accUp = 0;
                        }
                        else if (event.keyCode == 39) {
                            //right arrow was pressed
                            this._accRight = 0;
                        }
                        else if (event.keyCode == 40) {
                            //down arrow was pressed
                            this._accDown = 0;
                        }
                    };
                    this.setInspectable("acceleration", "number");
                    this.setInspectable("friction", "number");
                }
                initialized() {
                }
                attached() {
                    this._transform = this.entity.getComponent("Transform");
                }
                activated() {
                    document.addEventListener('keydown', this.keyDownHandler);
                    document.addEventListener('keyup', this.keyUpHandler);
                }
                deactivated() {
                    document.removeEventListener('keydown', this.keyDownHandler);
                    document.removeEventListener('keyup', this.keyUpHandler);
                }
                update(deltaMS, deltaSC) {
                    //accelerate
                    this._speedX += this._accLeft + this._accRight;
                    this._speedY += this._accUp + this._accDown;
                    //apply friction
                    this._speedX *= this.friction;
                    this._speedY *= this.friction;
                    this._transform.x += this._speedX * deltaSC;
                    this._transform.y += this._speedY * deltaSC;
                }
            }
            components.KeyboardPositionController = KeyboardPositionController;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=KeyboardPositionController.js.map