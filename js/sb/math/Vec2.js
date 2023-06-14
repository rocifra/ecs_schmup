var sb;
(function (sb) {
    var math;
    (function (math) {
        class Vec2 {
            constructor(x, y) {
                this.x = 0;
                this.y = 0;
                this.normalize = () => {
                    var l = this.length();
                    this.x = this.x / l;
                    this.y = this.y / l;
                    return this;
                };
                this.clone = () => { return new Vec2(this.x, this.y); };
                this.length = () => { return Math.sqrt(this.x * this.x + this.y * this.y); };
                this.set = (x, y) => { this.x = x; this.y = y; return this; };
                this.distance = (vec2) => {
                    var dx = vec2.x - this.x;
                    var dy = vec2.y - this.y;
                    return Math.sqrt(dx * dx + dy * dy);
                };
                this.x = x || 0;
                this.y = y || 0;
            }
            static add(v1, v2) { return new Vec2(v1.x + v2.x, v1.y + v2.y); }
            static mul(scalar, vec2) { return new Vec2(scalar * vec2.x, scalar * vec2.y); }
            static sub(v1, v2) { return new Vec2(v1.x - v2.x, v1.y - v2.y); }
            static dot(v1, v2) { return v1.x * v2.x + v1.y * v2.y; }
        }
        math.Vec2 = Vec2;
    })(math = sb.math || (sb.math = {}));
})(sb || (sb = {}));
//# sourceMappingURL=Vec2.js.map