var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            //requires VectorMotion, Transform, AngularTargetTracking
            class RocketLaunchSequence extends sb.ecs.Component {
                constructor() {
                    super(true);
                    this.launchDuration = 0;
                    this.launchDurationVariance = 0;
                    this.launchDirection = 0;
                    this.launchDirectionVariance = 0;
                    this.acceleration = 0;
                    this.launchEndFriction = 0;
                    this._currentTime = 0;
                    this._currentSpeed = 0;
                    this._launchSequenceEnded = false;
                    this.enableRocketComponents = () => {
                        this.entity.enableDynamicComponent("VectorMotion");
                        this.entity.enableDynamicComponent("AngularTargetTracking");
                        // this.entity.enableDynamicComponent("ParticleSystem");
                    };
                    this.disableRocketComponents = () => {
                        this.entity.disableDynamicComponent("VectorMotion");
                        this.entity.disableDynamicComponent("AngularTargetTracking");
                        //this.entity.disableDynamicComponent("PixiSprite");
                    };
                }
                attached() {
                    //requires VectorMotion, Transform, AngularTargetTracking
                    this._cTransform = this.entity.getComponent("Transform");
                    this.disableRocketComponents();
                }
                activated() {
                    this._currentTime = 0;
                    this._launchSequenceEnded = false;
                    this._currentSpeed = 0;
                }
                update(deltaMS, deltaSC) {
                    this._currentTime += deltaMS;
                    //check if time to enable components and disable self
                    if (this._currentTime >= this.launchDuration) {
                        if (!this._launchSequenceEnded)
                            this.enableRocketComponents();
                        this._launchSequenceEnded = true;
                        //apply friction
                        this._currentSpeed *= this.launchEndFriction;
                        if (this._currentSpeed < 0.5)
                            this.entity.disableDynamicComponent(this.stringID);
                    }
                    else {
                        //accelerate
                        this._currentSpeed += this.acceleration;
                    }
                    this._cTransform.x += Math.cos(this.launchDirection) * this._currentSpeed * deltaSC;
                    this._cTransform.y += Math.sin(this.launchDirection) * this._currentSpeed * deltaSC;
                }
            }
            components.RocketLaunchSequence = RocketLaunchSequence;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=RocketLaunchSequence.js.map