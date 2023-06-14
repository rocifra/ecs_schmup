namespace sb.ecs.components
{
    //requires Transform component   
    export class DeathSpawn extends sb.ecs.Component
    {
        public entityBlueprint: string;

        private _transform: Transform;

        constructor()
        {
            super(false);
        }

        public attached()
        {
            this._transform = <Transform>this.entity.getComponent("Transform");
        }

        public deactivated()
        {
            let explosion = this.entityManager.createEntityFromBlueprint(this.entityBlueprint);
            let explosionTransform = <Transform>explosion.getComponent("Transform");
            explosionTransform.x = this._transform.x;
            explosionTransform.y = this._transform.y;
            explosionTransform.rotation = this._transform.rotation;
            this.entityManager.addEntity(explosion);
        }

    }
}