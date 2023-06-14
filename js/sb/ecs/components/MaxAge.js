var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            class MaxAge extends sb.ecs.Component {
                constructor() {
                    super(true);
                    this.maxAge = 2000;
                    this._currentAge = 0;
                    this.setInspectable("maxAge", "number");
                }
                activated() {
                    this._currentAge = 0;
                }
                update(deltaMS, deltaSC) {
                    this._currentAge += deltaMS;
                    if (this._currentAge > this.maxAge) {
                        //remove entity
                        this.entity.removeSelf();
                    }
                }
            }
            components.MaxAge = MaxAge;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=MaxAge.js.map