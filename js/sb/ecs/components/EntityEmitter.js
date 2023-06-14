var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            //requires Transform component   
            class EntityEmitter extends sb.ecs.Component {
                constructor() {
                    super(true);
                    //public blueprintID: number = 1000;
                    this.interval = 1000;
                    this.xVariance = 0;
                    this.yVariance = 0;
                    this.rotationVariance = 0;
                    this.emitterX = 0;
                    this.emitterY = 0;
                    this.numEntitiesEmittedPerTick = 1;
                    this.currentTime = 0;
                    this.paused = false;
                    this.blueprintID = null;
                    this.emit = () => {
                        //build an entity bullet
                        let bullet = this.entityManager.createEntityFromBlueprint(this.blueprintID);
                        let transform = bullet.getComponent("Transform");
                        //set transform properties for the newly created entity with added variances					
                        transform.x = this._transform.x + this.emitterX + this.xVariance * (Math.random() * 2 - 1);
                        transform.y = this._transform.y + this.emitterY + this.yVariance * (Math.random() * 2 - 1);
                        transform.rotation = this._transform.rotation + this.rotationVariance * (Math.random() * 2 - 1);
                        this.entityManager.addEntity(bullet);
                    };
                    this.setInspectable("interval", "string");
                    this.setInspectable("xVariance", "number");
                    this.setInspectable("yVariance", "number");
                    this.setInspectable("rotationVariance", "number");
                    this.setInspectable("emitterX", "number");
                    this.setInspectable("emitterY", "number");
                    this.setInspectable("numEntitiesEmittedPerTick", "number");
                    this.setInspectable("paused", "boolean");
                    this.setInspectable("blueprintID", "string");
                }
                attached() {
                    //get refs
                    this._transform = this.entity.getComponent("Transform");
                }
                detached() {
                    this.paused = false;
                    //this._stateControlSignalInstance
                }
                activated() {
                    this.currentTime = 0;
                }
                deactivated() {
                }
                update(deltaMS, deltaSC) {
                    if (!this.paused) {
                        //update current time
                        this.currentTime += deltaMS;
                        //check if current time exceeded interval
                        if (this.currentTime >= this.interval) {
                            //emit entity
                            for (let i = 0; i < this.numEntitiesEmittedPerTick; i++)
                                this.emit();
                            //reset current time
                            this.currentTime = 0;
                        }
                    }
                }
            }
            components.EntityEmitter = EntityEmitter;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=EntityEmitter.js.map