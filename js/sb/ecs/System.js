var sb;
(function (sb) {
    var ecs;
    (function (ecs) {
        class System {
            constructor(isDynamic) {
                this._isDynamic = isDynamic;
            }
            //overridables
            //
            activated() { }
            //
            deactivated() { }
            //called each tick if component is set as dynamic | override to implement logic
            update(deltaMS, deltaSC) { }
            get isDynamic() { return this._isDynamic; }
        }
        ecs.System = System;
    })(ecs = sb.ecs || (sb.ecs = {}));
})(sb || (sb = {}));
//# sourceMappingURL=System.js.map