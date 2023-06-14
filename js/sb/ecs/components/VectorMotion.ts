namespace sb.ecs.components
{
    export class VectorMotion extends sb.ecs.Component
    {
        public speed: number = 0;
        public maxSpeed: number = 0;
        public acceleration: number = 0;
        public friction: number = 1;

        private _transform: Transform;

        constructor()
        {
            super(true);
            this.setInspectable("speed", "number");
            this.setInspectable("maxSpeed", "number");
            this.setInspectable("acceleration", "number");
            this.setInspectable("friction", "number");
        }

        public attached(): void
        {
            this._transform = <Transform>this.entity.getComponent("Transform");
        }

        public update(deltaMS: number, deltaSC: number): void
        {
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
}