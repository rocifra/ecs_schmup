namespace sb.math
{

    export class Vec2
    {
        public x: number = 0;
        public y: number = 0;

        constructor(x?: number, y?: number)
        {
            this.x = x || 0;
            this.y = y || 0;
        }

        public normalize = (): Vec2 =>
        {
            var l = this.length();
            this.x = this.x / l;
            this.y = this.y / l;
            return this;
        }
        public clone = (): Vec2 => { return new Vec2(this.x, this.y) }
        public length = (): number => { return Math.sqrt(this.x * this.x + this.y * this.y) }
        public set = (x: number, y: number) => { this.x = x; this.y = y; return this }
        public distance = (vec2: Vec2): number=>
        {
            var dx = vec2.x - this.x;
            var dy = vec2.y - this.y;
            return Math.sqrt(dx * dx + dy * dy);
        };

        public static add(v1: Vec2, v2: Vec2): Vec2 { return new Vec2(v1.x + v2.x, v1.y + v2.y); }
        public static mul(scalar: number, vec2: Vec2): Vec2 { return new Vec2(scalar * vec2.x, scalar * vec2.y); }
        public static sub(v1: Vec2, v2: Vec2): Vec2 { return new Vec2(v1.x - v2.x, v1.y - v2.y); }
        public static dot(v1: Vec2, v2: Vec2): number { return v1.x * v2.x + v1.y * v2.y; }
    }
}