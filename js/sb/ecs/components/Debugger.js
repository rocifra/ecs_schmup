var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        var components;
        (function (components) {
            //requires Transform component   
            class Debugger extends sb.ecs.Component {
                constructor() {
                    super(true);
                }
                attached() {
                    this._transform = this.entity.getComponent("Transform");
                }
                update(deltaMS, deltaSC) {
                    console.log(this._transform.x, this._transform.y, this._transform.rotation);
                }
            }
            components.Debugger = Debugger;
        })(components = ecs.components || (ecs.components = {}));
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Debugger.js.map