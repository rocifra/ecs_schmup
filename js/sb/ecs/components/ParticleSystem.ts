namespace sb.ecs.components
{
    export class ParticleSystem extends sb.ecs.Component
    {
        public configuration: any;

        public transform: Transform;
        public emitter: PIXI.particles.Emitter;

        constructor()
        {
            super(false);
           
        }

        public attached()
        {
            this.transform = <Transform>this.entity.getComponent("Transform");
        }
    }
}