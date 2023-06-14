namespace sb.ecs.components
{
    export class Transform extends sb.ecs.Component
    {
        public x: number = 0;
        public y: number = 0;
        public rotation: number = 0;

        constructor()
        {
            super(false);

            this.setInspectable("x", "number");
            this.setInspectable("y", "number");
            this.setInspectable("rotation", "number");
        }

        
    }
}